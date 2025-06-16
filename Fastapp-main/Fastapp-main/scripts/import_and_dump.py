import os
import subprocess
import time
from pathlib import Path

def wait_for_db():
    """Wait for the database to be ready"""
    while True:
        try:
            result = subprocess.run(
                ["docker", "compose", "exec", "db", "pg_isready", "-U", "iqraa_user", "-d", "iqraa_db"],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                print("Database is ready!")
                break
        except Exception as e:
            print(f"Waiting for database... {e}")
        time.sleep(5)

def import_reviews():
    """Run the import script"""
    print("Starting import...")
    subprocess.run(["python", "scripts/import_amazon_reviews.py"], check=True)
    print("Import completed!")

def create_dump():
    """Create a database dump"""
    print("Creating database dump...")
    dump_dir = Path("dumps")
    dump_dir.mkdir(exist_ok=True)
    
    dump_file = dump_dir / "initial_data.sql"
    subprocess.run([
        "docker", "compose", "exec", "db",
        "pg_dump", "-U", "iqraa_user", "-d", "iqraa_db",
        "-f", "/tmp/initial_data.sql"
    ], check=True)
    
    # Copy the dump file from the container
    subprocess.run([
        "docker", "compose", "cp",
        "db:/tmp/initial_data.sql",
        str(dump_file)
    ], check=True)
    print(f"Database dump created at {dump_file}")

def main():
    # Wait for database to be ready
    wait_for_db()
    
    # Import the reviews
    import_reviews()
    
    # Create the dump
    create_dump()
    
    print("Process completed successfully!")

if __name__ == "__main__":
    main() 