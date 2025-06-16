from fastapi import APIRouter
from app.api.endpoints import books, users, reviews, orders, recommendations

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(books.router, prefix="/books", tags=["books"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"]) 