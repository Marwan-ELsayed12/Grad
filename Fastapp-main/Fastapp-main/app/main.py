from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.api_v1.api import api_router
from app.core.config import settings
from app.db.session import engine
from app.models import Base
from app.db.init_db import init_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize database with superuser
init_db()

@app.get("/")
async def root():
    return {"message": "Welcome to FastApp API"}

@app.get("/admin")
async def admin():
    return {"message": "Admin Dashboard"}