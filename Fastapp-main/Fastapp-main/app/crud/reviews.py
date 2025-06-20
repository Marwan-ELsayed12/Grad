from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_, desc
from typing import List, Optional, Dict, Tuple
from datetime import datetime, timedelta
from decimal import Decimal

from app.models.reviews import BookReview, ReviewHelpfulVote
from app.models.books import Book
from app.schemas.reviews import BookReviewCreate, BookReviewUpdate, ReviewHelpfulVoteCreate

def get_book_review(db: Session, review_id: int) -> Optional[BookReview]:
    return db.query(BookReview).filter(BookReview.review_id == review_id).first()

def get_book_reviews(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    book_id: Optional[int] = None,
    user_id: Optional[int] = None,
    min_rating: Optional[Decimal] = None,
    max_rating: Optional[Decimal] = None,
    verified_only: bool = False,
    source: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    sort_by: str = "date",
    sort_order: str = "desc"
) -> List[BookReview]:
    query = db.query(BookReview)
    
    if book_id:
        query = query.filter(BookReview.book_id == book_id)
    if user_id:
        query = query.filter(BookReview.user_id == user_id)
    if min_rating:
        query = query.filter(BookReview.rating >= min_rating)
    if max_rating:
        query = query.filter(BookReview.rating <= max_rating)
    if verified_only:
        query = query.filter(BookReview.verified_purchase == True)
    if source:
        query = query.filter(BookReview.source == source)
    if start_date:
        query = query.filter(BookReview.review_date >= start_date)
    if end_date:
        query = query.filter(BookReview.review_date <= end_date)
    
    # Apply sorting
    if sort_by == "date":
        query = query.order_by(desc(BookReview.review_date) if sort_order == "desc" else BookReview.review_date)
    elif sort_by == "rating":
        query = query.order_by(desc(BookReview.rating) if sort_order == "desc" else BookReview.rating)
    elif sort_by == "helpful":
        query = query.order_by(desc(BookReview.helpful_votes) if sort_order == "desc" else BookReview.helpful_votes)
    
    return query.offset(skip).limit(limit).all()

def create_book_review(db: Session, review: BookReviewCreate, user_id: int) -> BookReview:
    # Check if user has already reviewed this book
    existing_review = db.query(BookReview).filter(
        and_(BookReview.book_id == review.book_id, BookReview.user_id == user_id)
    ).first()
    
    if existing_review:
        raise ValueError("User has already reviewed this book")
    
    db_review = BookReview(
        user_id=user_id,
        book_id=review.book_id,
        rating=review.rating,
        review_text=review.review_text,
        review_date=datetime.utcnow(),
        helpful_votes=0,
        verified_purchase=review.verified_purchase,
        source=review.source,
        external_review_id=review.external_review_id
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def update_book_review(db: Session, review_id: int, review: BookReviewUpdate, user_id: int) -> Optional[BookReview]:
    db_review = get_book_review(db, review_id)
    if not db_review or db_review.user_id != user_id:
        return None
    
    update_data = review.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_review, field, value)
    
    db_review.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_review)
    return db_review

def delete_book_review(db: Session, review_id: int, user_id: int) -> bool:
    db_review = get_book_review(db, review_id)
    if not db_review or db_review.user_id != user_id:
        return False
    
    db.delete(db_review)
    db.commit()
    return True

def vote_review(db: Session, vote: ReviewHelpfulVoteCreate, user_id: int) -> Optional[ReviewHelpfulVote]:
    # Check if user has already voted on this review
    existing_vote = db.query(ReviewHelpfulVote).filter(
        and_(ReviewHelpfulVote.review_id == vote.review_id, ReviewHelpfulVote.user_id == user_id)
    ).first()
    
    if existing_vote:
        # Update existing vote
        existing_vote.is_helpful = vote.is_helpful
        db.commit()
        db.refresh(existing_vote)
        return existing_vote
    
    # Create new vote
    db_vote = ReviewHelpfulVote(
        review_id=vote.review_id,
        user_id=user_id,
        is_helpful=vote.is_helpful,
        created_at=datetime.utcnow()
    )
    db.add(db_vote)
    
    # Update helpful votes count
    review = get_book_review(db, vote.review_id)
    if review:
        review.helpful_votes = db.query(ReviewHelpfulVote).filter(
            and_(ReviewHelpfulVote.review_id == vote.review_id, ReviewHelpfulVote.is_helpful == True)
        ).count()
    
    db.commit()
    db.refresh(db_vote)
    return db_vote

def get_recent_reviews(db: Session, limit: int = 10) -> List[BookReview]:
    return db.query(BookReview).order_by(desc(BookReview.review_date)).limit(limit).all()

def get_user_reviews(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[BookReview]:
    return db.query(BookReview).filter(BookReview.user_id == user_id).offset(skip).limit(limit).all()

def get_review_stats(db: Session, book_id: Optional[int] = None) -> Dict:
    query = db.query(BookReview)
    if book_id:
        query = query.filter(BookReview.book_id == book_id)
    
    total_reviews = query.count()
    avg_rating = query.with_entities(func.avg(BookReview.rating)).scalar() or 0
    verified_reviews = query.filter(BookReview.verified_purchase == True).count()
    
    return {
        "total_reviews": total_reviews,
        "average_rating": float(avg_rating),
        "verified_reviews": verified_reviews
    } 