from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

router = APIRouter()

# ======== Models ========

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[int] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    books: List['Book'] = []

    class Config:
        from_attributes = True

class BookBase(BaseModel):
    isbn: Optional[str] = None
    title: str
    author: str
    publisher: Optional[str] = None
    publication_year: Optional[int] = None
    price: Decimal = Field(..., ge=0, decimal_places=2)
    stock_quantity: int = Field(default=0, ge=0)
    available_for_borrow: bool = True
    description: Optional[str] = None

class BookCreate(BookBase):
    category_ids: List[int] = []

class BookUpdate(BaseModel):
    isbn: Optional[str] = None
    title: Optional[str] = None
    author: Optional[str] = None
    publisher: Optional[str] = None
    publication_year: Optional[int] = None
    price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    stock_quantity: Optional[int] = Field(None, ge=0)
    available_for_borrow: Optional[bool] = None
    description: Optional[str] = None
    category_ids: Optional[List[int]] = None

class Book(BookBase):
    book_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    categories: List[Category] = []

    class Config:
        from_attributes = True

# Resolve forward references
Category.model_rebuild()
Book.model_rebuild()

# ======== Sample Endpoint ========

@router.get("/", response_model=List[Book])
def get_books():
    # Placeholder response (mock data)
    return [
        Book(
            book_id=1,
            title="Sample Book",
            author="Author Name",
            isbn="1234567890",
            publisher="Test Publisher",
            publication_year=2023,
            price=99.99,
            stock_quantity=5,
            available_for_borrow=True,
            description="A sample book for testing",
            created_at=datetime.utcnow(),
            updated_at=None,
            categories=[]
        )
    ]
