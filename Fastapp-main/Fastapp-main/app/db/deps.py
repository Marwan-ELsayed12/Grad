from typing import Generator
from sqlalchemy.orm import Session
from app.db.session import SessionLocal

def get_db() -> Generator[Session, None, None]:
    """
    Dependency for getting DB session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

__all__ = ['get_db'] 