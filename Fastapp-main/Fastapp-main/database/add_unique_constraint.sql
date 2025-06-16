-- Add unique constraint for book_id and user_id in book_reviews table
ALTER TABLE book_reviews
ADD CONSTRAINT book_reviews_book_user_unique UNIQUE (book_id, user_id); 