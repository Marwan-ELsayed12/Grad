from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.crud.users import create_superuser
from app.core.config import settings

def init_db() -> None:
    """
    Initialize the database with a superuser if it doesn't exist.
    """
    db = SessionLocal()
    try:
        # Create superuser if it doesn't exist
        create_superuser(
            db,
            email=settings.FIRST_SUPERUSER_EMAIL,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            username=settings.FIRST_SUPERUSER_USERNAME,
            full_name=settings.FIRST_SUPERUSER_FULL_NAME
        )
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 