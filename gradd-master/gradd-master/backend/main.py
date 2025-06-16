from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
import jwt
from datetime import datetime, timedelta

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT settings
SECRET_KEY = "your-secret-key"  # In production, use a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    email: str
    password: str

# Mock user database (replace with real database in production)
fake_users_db = {
    "demo@example.com": {
        "email": "demo@example.com",
        "password": "demo123",  # In production, use hashed passwords
    }
}

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Login endpoint
@app.post("/api/v1/auth/login")
async def login(user: User):
    if user.email not in fake_users_db:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.password != fake_users_db[user.email]["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/api/v1/books")
async def get_books():
    return []

@app.get("/api/v1/orders")
async def get_orders():
    return []

@app.get("/api/v1/orders/borrowed")
async def get_borrowed_books():
    return []

@app.get("/api/v1/orders/purchased")
async def get_purchased_books():
    return []

@app.get("/api/v1/wishlist")
async def get_wishlist():
    return [] 