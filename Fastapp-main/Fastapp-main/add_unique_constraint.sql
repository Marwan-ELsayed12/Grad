ALTER TABLE books ADD CONSTRAINT books_book_id_key UNIQUE (book_id);
ALTER TABLE books ADD CONSTRAINT books_isbn_key UNIQUE (isbn); 