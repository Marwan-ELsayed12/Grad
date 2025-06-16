import pandas as pd # type: ignore
import psycopg2
from psycopg2.extras import execute_values
import os
from datetime import datetime, timezone
import logging
import random
import time
from pathlib import Path
import json
import pickle
from typing import Optional, Tuple
import hashlib

# Set up logging with rotation
from logging.handlers import RotatingFileHandler

# Create logs directory if it doesn't exist
Path('logs').mkdir(exist_ok=True)

# Set up logging with rotation (10MB max size, keep 5 backup files)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler('logs/import_reviews.log', maxBytes=10*1024*1024, backupCount=5),
        logging.StreamHandler()
    ]
)

# Database connection parameters
DB_PARAMS = {
    'dbname': 'iqraa_db',
    'user': 'iqraa_user',
    'password': 'iqraa_password',
    'host': 'db',  # Changed from 'localhost' to 'db' to match Docker service name
    'port': '5432'
}

def string_to_int(s: str) -> int:
    """Convert a string to a positive integer using hash function"""
    # Use SHA-256 hash and take first 8 bytes to get a positive integer
    hash_object = hashlib.sha256(s.encode())
    return int(hash_object.hexdigest()[:8], 16)

def verify_database_connection():
    """Verify database connection and required tables exist"""
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        with conn.cursor() as cur:
            # Check if required tables exist
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('users', 'books', 'book_reviews')
            """)
            tables = {row[0] for row in cur.fetchall()}
            required_tables = {'users', 'books', 'book_reviews'}
            missing_tables = required_tables - tables
            if missing_tables:
                raise Exception(f"Missing required tables: {missing_tables}")
            
            # Add unique constraint on book_id if it doesn't exist
            cur.execute("""
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1
                        FROM pg_constraint
                        WHERE conname = 'books_book_id_key'
                    ) THEN
                        ALTER TABLE books ADD CONSTRAINT books_book_id_key UNIQUE (book_id);
                    END IF;
                END $$;
            """)
            conn.commit()
            
            logging.info("Database connection and tables verified successfully")
        return conn
    except Exception as e:
        logging.error(f"Database verification failed: {e}")
        raise

def verify_csv_file(file_path):
    """Verify CSV file exists and is readable"""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"CSV file not found: {file_path}")
    
    try:
        # Try to read first few rows to verify file is readable
        df_sample = pd.read_csv(file_path, nrows=5)
        required_columns = {'book_id', 'title', 'authors', 'rating', 'review/text'}
        missing_columns = required_columns - set(df_sample.columns)
        if missing_columns:
            raise ValueError(f"Missing required columns in CSV: {missing_columns}")
        logging.info(f"CSV file verified successfully. Found columns: {', '.join(df_sample.columns)}")
        return True
    except Exception as e:
        logging.error(f"CSV file verification failed: {e}")
        raise

def create_temp_user(conn, username):
    """Create a temporary user for Amazon reviews with proper password hashing"""
    with conn.cursor() as cur:
        # Use a more secure password hash
        password_hash = f"amazon_import_{int(time.time())}"  # In production, use proper password hashing
        now = datetime.now(timezone.utc)
        cur.execute("""
            INSERT INTO users (username, email, password_hash, full_name, is_active, is_admin, is_superuser, favorite_genres, notification_preferences, is_verified, last_active, created_at, updated_at, is_staff)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (username) DO UPDATE
            SET email = EXCLUDED.email,
                password_hash = EXCLUDED.password_hash,
                full_name = EXCLUDED.full_name,
                is_active = EXCLUDED.is_active,
                is_admin = EXCLUDED.is_admin,
                is_superuser = EXCLUDED.is_superuser,
                favorite_genres = EXCLUDED.favorite_genres,
                notification_preferences = EXCLUDED.notification_preferences,
                is_verified = EXCLUDED.is_verified,
                last_active = EXCLUDED.last_active,
                created_at = EXCLUDED.created_at,
                updated_at = EXCLUDED.updated_at,
                is_staff = EXCLUDED.is_staff
            RETURNING id
        """, (username, f"{username}@amazon.com", password_hash, f"Amazon User {username}", True, False, False, [], json.dumps({}), False, now, now, now, False))
        conn.commit()
        user_id = cur.fetchone()[0]
        logging.info(f"Created/updated temporary user {username} with ID: {user_id}")
        return user_id

def create_specific_user(conn, username, password):
    """Create a specific user with given credentials and admin privileges"""
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO users (username, email, password_hash, full_name, is_admin, is_superuser, favorite_genres, notification_preferences, is_verified, last_active, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (username) DO NOTHING
            RETURNING id
        """, (username, f"{username}@bookstore.com", password, f"{username.capitalize()} User", True, True, [], json.dumps({}), False, datetime.now(timezone.utc), datetime.now(timezone.utc), datetime.now(timezone.utc)))
        conn.commit()
        return cur.fetchone()[0] if cur.rowcount > 0 else None

def load_checkpoint() -> Optional[int]:
    """Load the last processed row index from checkpoint file"""
    checkpoint_file = 'logs/import_checkpoint.pkl'
    if os.path.exists(checkpoint_file):
        try:
            with open(checkpoint_file, 'rb') as f:
                return pickle.load(f)
        except Exception as e:
            logging.warning(f"Failed to load checkpoint: {e}")
    return None

def save_checkpoint(row_index: int):
    """Save the current row index to checkpoint file"""
    checkpoint_file = 'logs/import_checkpoint.pkl'
    try:
        with open(checkpoint_file, 'wb') as f:
            pickle.dump(row_index, f)
    except Exception as e:
        logging.error(f"Failed to save checkpoint: {e}")

def check_nan_values(df):
    """Check for NaN values in each column of the dataframe"""
    nan_counts = df.isna().sum()
    total_rows = len(df)
    
    logging.info("\nNaN Value Analysis:")
    logging.info("-" * 50)
    for column, count in nan_counts.items():
        percentage = (count / total_rows) * 100
        logging.info(f"Column: {column}")
        logging.info(f"NaN count: {count}")
        logging.info(f"Percentage: {percentage:.2f}%")
        if count > 0:
            # Show sample of rows with NaN values
            sample_nan = df[df[column].isna()].head(3)
            logging.info(f"Sample rows with NaN in {column}:")
            logging.info(sample_nan[[column]].to_string())
        logging.info("-" * 50)

def process_batch(conn, batch_df, amazon_user_id):
    """Process a batch of reviews"""
    with conn.cursor() as cur:
        try:
            # Start transaction
            cur.execute("BEGIN")
            
            for _, row in batch_df.iterrows():
                try:
                    # Handle missing values with defaults
                    amazon_id = str(row.get('book_id', ''))
                    if not amazon_id or amazon_id.lower() == 'nan':
                        logging.warning("Skipping row with missing book_id")
                        continue
                    
                    # Convert Amazon ID to integer using hash function
                    book_id = string_to_int(amazon_id)
                    
                    title = str(row.get('title', ''))[:255] if pd.notna(row.get('title')) else f"Unknown Book {amazon_id}"
                    authors = str(row.get('authors', ''))[:100] if pd.notna(row.get('authors')) else "Unknown Author"
                    price = float(row.get('price', 0)) if pd.notna(row.get('price')) else random.uniform(30, 200)
                    available_for_borrow = True
                    now = datetime.now(timezone.utc)

                    # Insert or update book
                    cur.execute("""
                        INSERT INTO books (
                            book_id, isbn, title, author, publisher, publication_year,
                            price, stock_quantity, available_for_borrow, description,
                            created_at, updated_at
                        ) VALUES (
                            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                        ) ON CONFLICT (book_id) DO UPDATE
                        SET title = EXCLUDED.title,
                            author = EXCLUDED.author,
                            price = EXCLUDED.price,
                            updated_at = EXCLUDED.updated_at
                    """, (
                        book_id, amazon_id, title, authors, "Amazon", None,
                        price, 10, available_for_borrow, None, now, now
                    ))

                    # Insert review if rating exists
                    if pd.notna(row.get('rating')):
                        rating = float(row.get('rating', 0))
                        review_text = str(row.get('review/text', '')) if pd.notna(row.get('review/text')) else None
                        
                        cur.execute("""
                            INSERT INTO book_reviews (
                                book_id, user_id, rating, review_text, created_at, updated_at
                            ) VALUES (
                                %s, %s, %s, %s, %s, %s
                            ) ON CONFLICT (book_id, user_id) DO UPDATE
                            SET rating = EXCLUDED.rating,
                                review_text = EXCLUDED.review_text,
                                updated_at = EXCLUDED.updated_at
                        """, (
                            book_id, amazon_user_id, rating, review_text, now, now
                        ))

                except Exception as e:
                    logging.error(f"Error processing row: {e}")
                    continue

            # Commit transaction
            conn.commit()
            logging.info(f"Successfully processed batch of {len(batch_df)} rows")
            
        except Exception as e:
            conn.rollback()
            logging.error(f"Error processing batch: {e}")
            raise

def import_reviews(limit: Optional[int] = None):
    """Import reviews from CSV file"""
    start_time = time.time()
    conn = None
    try:
        # Verify database connection
        conn = verify_database_connection()
        
        # Verify CSV file
        csv_file = "scripts/amazon_book_reviews_CLEAN.csv"  # Updated file path
        verify_csv_file(csv_file)

        # Read the CSV file with progress tracking
        logging.info("Reading Amazon reviews CSV file...")
        df = pd.read_csv(csv_file)
        if limit:
            df = df.head(limit)
            logging.info(f"Test run: Importing first {limit} rows")
        
        # Check for NaN values
        check_nan_values(df)
        
        total_rows = len(df)
        logging.info(f"Total rows to process: {total_rows}")

        # Create temporary user
        amazon_user_id = create_temp_user(conn, "amazon_reviews")

        # Process in smaller batches for better error handling
        batch_size = min(100, total_rows)  # Smaller batch size for test run
        last_progress_update = time.time()
        progress_interval = 2  # Update progress more frequently for test run

        for batch_start in range(0, total_rows, batch_size):
            batch_end = min(batch_start + batch_size, total_rows)
            batch = df.iloc[batch_start:batch_end]
            
            # Start a new transaction for each batch
            cur = conn.cursor()
            try:
                process_batch(conn, batch, amazon_user_id)
                
                conn.commit()
                total_processed = len(batch)
                total_skipped = 0
                total_errors = 0
                
                # Update progress periodically
                current_time = time.time()
                if current_time - last_progress_update >= progress_interval:
                    elapsed = current_time - start_time
                    progress = (batch_end / total_rows) * 100
                    speed = total_processed / elapsed if elapsed > 0 else 0
                    eta = (total_rows - batch_end) / speed if speed > 0 else 0
                    
                    logging.info(
                        f"Progress: {progress:.1f}% | "
                        f"Processed: {total_processed} | "
                        f"Skipped: {total_skipped} | "
                        f"Errors: {total_errors} | "
                        f"Speed: {speed:.1f} rows/s | "
                        f"ETA: {eta/60:.1f} minutes"
                    )
                    last_progress_update = current_time

            except Exception as e:
                logging.error(f"Fatal error in batch {batch_start}-{batch_end}: {e}")
                conn.rollback()
                total_errors += len(batch)
            finally:
                cur.close()

        # Final statistics
        total_time = time.time() - start_time
        logging.info(f"""
Import completed:
- Total rows processed: {total_processed}
- Total rows skipped: {total_skipped}
- Total errors: {total_errors}
- Total time: {total_time:.2f}s
- Average speed: {total_processed/total_time:.2f} rows/second
        """)

    except Exception as e:
        logging.error(f"Fatal error during import: {e}")
        raise
    finally:
        if 'conn' in locals() and conn:
            conn.close()
            logging.info("Database connection closed")

def run(*args, **kwargs):
    """Entry point for django-extensions runscript"""
    try:
        logging.info("Starting Amazon reviews import process (full run)")
        import_reviews()  # Import all rows
        logging.info("Import process completed successfully")
    except Exception as e:
        logging.error(f"Import process failed: {e}")
        raise

    logging.info("Starting user creation process")
    try:
        conn = verify_database_connection()
        # Note: The original script tried to create a user 'ahmed' with a hardcoded password here.
        # This might not be desired when running with runscript. 
        # I will keep it commented out for now.
        # user_id = create_specific_user(conn, "ahmed", "bookstore1")
        # if user_id:
        #     logging.info(f"Successfully created/updated user 'ahmed' with ID: {user_id}")
        # else:
        #     logging.warning("User 'ahmed' already exists and was updated")
        conn.close()
    except Exception as e:
        logging.error(f"Error creating user: {e}")
        # Depending on requirements, you might want to raise or just log this error
        # raise 

if __name__ == "__main__":
    import_reviews() 