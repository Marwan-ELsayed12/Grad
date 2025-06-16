ALTER TABLE book_category DROP CONSTRAINT book_category_book_id_fkey;
ALTER TABLE books ALTER COLUMN book_id TYPE character varying(255); 