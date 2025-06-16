-- Delete duplicate entries keeping the most recent one
DELETE FROM book_reviews a
USING book_reviews b
WHERE a.book_id = b.book_id 
AND a.user_id = b.user_id
AND a.review_id < b.review_id; 