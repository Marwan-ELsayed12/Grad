from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class UserActivity(Base):
    """Represents user activities like views, searches, etc."""
    __tablename__ = "user_activities"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    book_id = Column(Integer, ForeignKey('books.book_id', ondelete='CASCADE'))
    activity_type = Column(String(50))  # e.g., 'view', 'search', 'purchase'
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="activities")
    book = relationship("Book", back_populates="user_activities") 