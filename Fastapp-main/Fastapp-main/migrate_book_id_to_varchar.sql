-- 1. Drop all foreign key constraints referencing books.book_id
ALTER TABLE book_category DROP CONSTRAINT IF EXISTS book_category_book_id_fkey;
ALTER TABLE book_reviews DROP CONSTRAINT IF EXISTS book_reviews_book_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_book_id_fkey;
ALTER TABLE recommendation_books DROP CONSTRAINT IF EXISTS recommendation_books_book_id_fkey;
ALTER TABLE recommendation_items DROP CONSTRAINT IF EXISTS recommendation_items_book_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_book_id_fkey;
ALTER TABLE transaction_items DROP CONSTRAINT IF EXISTS transaction_items_book_id_fkey;
ALTER TABLE user_activities DROP CONSTRAINT IF EXISTS user_activities_book_id_fkey;
ALTER TABLE recommendations DROP CONSTRAINT IF EXISTS recommendations_source_book_id_fkey;

-- 2. Change book_id columns to character varying(255)
ALTER TABLE book_category ALTER COLUMN book_id TYPE character varying(255);
ALTER TABLE book_reviews ALTER COLUMN book_id TYPE character varying(255);
ALTER TABLE orders ALTER COLUMN book_id TYPE character varying(255);
ALTER TABLE recommendation_books ALTER COLUMN book_id TYPE character varying(255);
ALTER TABLE recommendation_items ALTER COLUMN book_id TYPE character varying(255);
ALTER TABLE reviews ALTER COLUMN book_id TYPE character varying(255);
ALTER TABLE transaction_items ALTER COLUMN book_id TYPE character varying(255);
ALTER TABLE user_activities ALTER COLUMN book_id TYPE character varying(255);
ALTER TABLE books ALTER COLUMN book_id TYPE character varying(255);
ALTER TABLE recommendations ALTER COLUMN source_book_id TYPE character varying(255);

-- 3. Re-add the foreign key constraints
ALTER TABLE book_category ADD CONSTRAINT book_category_book_id_fkey FOREIGN KEY (book_id) REFERENCES books(book_id);
ALTER TABLE book_reviews ADD CONSTRAINT book_reviews_book_id_fkey FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE;
ALTER TABLE orders ADD CONSTRAINT orders_book_id_fkey FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE;
ALTER TABLE recommendation_books ADD CONSTRAINT recommendation_books_book_id_fkey FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE;
ALTER TABLE recommendation_items ADD CONSTRAINT recommendation_items_book_id_fkey FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE;
ALTER TABLE reviews ADD CONSTRAINT reviews_book_id_fkey FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE;
ALTER TABLE transaction_items ADD CONSTRAINT transaction_items_book_id_fkey FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE;
ALTER TABLE user_activities ADD CONSTRAINT user_activities_book_id_fkey FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE;
ALTER TABLE recommendations ADD CONSTRAINT recommendations_source_book_id_fkey FOREIGN KEY (source_book_id) REFERENCES books(book_id) ON DELETE SET NULL; 