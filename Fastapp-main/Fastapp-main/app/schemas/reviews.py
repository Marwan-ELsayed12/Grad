from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict
from datetime import datetime
from decimal import Decimal

class BookReviewBase(BaseModel):
    rating: Decimal = Field(..., ge=1, le=5, decimal_places=1)
    review_text: Optional[str] = None
    verified_purchase: bool = False
    source: str = "amazon"
    external_review_id: Optional[str] = None

class BookReviewCreate(BookReviewBase):
    book_id: int

class BookReviewUpdate(BaseModel):
    rating: Optional[Decimal] = Field(None, ge=1, le=5, decimal_places=1)
    review_text: Optional[str] = None
    verified_purchase: Optional[bool] = None
    source: Optional[str] = None
    external_review_id: Optional[str] = None

class BookReview(BookReviewBase):
    review_id: int
    user_id: int
    book_id: int
    review_date: datetime
    helpful_votes: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ReviewHelpfulVoteCreate(BaseModel):
    review_id: int
    is_helpful: bool

class ReviewHelpfulVote(ReviewHelpfulVoteCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class SentimentAnalysis(BaseModel):
    sentiment: str
    score: float

class BookSentimentStats(BaseModel):
    book_id: int
    average_sentiment: float
    sentiment_distribution: Dict[str, int]

class ReviewStats(BaseModel):
    total_reviews: int
    average_rating: float
    verified_reviews: int 