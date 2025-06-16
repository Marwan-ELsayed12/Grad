import numpy as np
from sqlalchemy import func, and_, or_
from sqlalchemy.orm import Session
from app.models.books import Book
from app.models.reviews import BookReview
from app.models.orders import Order

class HybridRecommender:
    def __init__(self, db: Session):
        self.db = db
        self.collaborative_weight = 0.4
        self.content_weight = 0.3
        self.popularity_weight = 0.3

    def get_hybrid_recommendations(self, user_id: int, book_title: str, n_recommendations: int = 10):
        """
        Get hybrid recommendations based on collaborative filtering, content-based filtering,
        and popularity.
        """
        # Get collaborative recommendations
        collab_recs = self._get_collaborative_recommendations(user_id)
        
        # Get content-based recommendations
        content_recs = self._get_content_recommendations(book_title)
        
        # Get popular books
        popular_recs = self._get_popular_books()
        
        # Combine recommendations with weights
        final_scores = {}
        
        # Add collaborative scores
        for book_id, score in collab_recs.items():
            final_scores[book_id] = score * self.collaborative_weight
            
        # Add content-based scores
        for book_id, score in content_recs.items():
            if book_id in final_scores:
                final_scores[book_id] += score * self.content_weight
            else:
                final_scores[book_id] = score * self.content_weight
                
        # Add popularity scores
        for book_id, score in popular_recs.items():
            if book_id in final_scores:
                final_scores[book_id] += score * self.popularity_weight
            else:
                final_scores[book_id] = score * self.popularity_weight
        
        # Sort and get top N recommendations
        sorted_recs = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)
        return [book_id for book_id, _ in sorted_recs[:n_recommendations]]

    def _get_collaborative_recommendations(self, user_id: int):
        """
        Get recommendations based on user behavior and preferences.
        """
        # Get books that users with similar preferences have liked
        similar_users = self._get_similar_users(user_id)
        book_scores = {}
        
        for user in similar_users:
            # Get books liked by similar users
            liked_books = self.db.query(BookReview.book_id).filter(
                BookReview.user_id == user,
                BookReview.rating >= 4
            ).all()
            
            for book_id in liked_books:
                if book_id not in book_scores:
                    book_scores[book_id] = 0
                book_scores[book_id] += 1
                
        return book_scores

    def _get_content_recommendations(self, book_title: str):
        """
        Get recommendations based on book content and metadata.
        """
        try:
            source_book = self.db.query(Book).filter(Book.title == book_title).first()
            if not source_book:
                return {}
                
            book_scores = {}
            
            # Find books with similar genres
            similar_books = self.db.query(Book).filter(
                Book.genre == source_book.genre
            ).filter(Book.id != source_book.id).all()
            
            for book in similar_books:
                # Calculate similarity score based on genre match
                book_scores[book.id] = 1.0
                
            return book_scores
        except Exception:
            return {}

    def _get_popular_books(self):
        """
        Get recommendations based on book popularity.
        """
        # Calculate popularity based on views, ratings, and purchases
        popular_books = self.db.query(
            Book,
            func.count(Book.id).label('view_count'),
            func.count(BookReview.id).label('rating_count'),
            func.count(Order.id).label('purchase_count'),
            func.avg(BookReview.rating).label('avg_rating')
        ).outerjoin(BookReview).outerjoin(Order).group_by(Book.id).all()
        
        book_scores = {}
        for book, view_count, rating_count, purchase_count, avg_rating in popular_books:
            score = (
                view_count * 0.4 +
                rating_count * 0.3 +
                purchase_count * 0.3
            )
            if avg_rating:
                score *= (avg_rating / 5.0)
            book_scores[book.id] = score
            
        return book_scores

    def _get_similar_users(self, user_id: int):
        """
        Get users with similar preferences.
        """
        # Get the user's favorite genres
        user_genres = set(
            self.db.query(Book.genre)
            .join(BookReview)
            .filter(
                BookReview.user_id == user_id,
                BookReview.rating >= 4
            )
            .distinct()
            .all()
        )
        
        # Find users who like similar genres
        similar_users = set()
        for genre in user_genres:
            users = set(
                self.db.query(BookReview.user_id)
                .join(Book)
                .filter(
                    Book.genre == genre,
                    BookReview.rating >= 4
                )
                .distinct()
                .all()
            )
            similar_users.update(users)
            
        return similar_users 