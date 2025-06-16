from sqlalchemy.orm import DeclarativeBase

# Base class for declarative models
class Base(DeclarativeBase):
    pass

# Export Base
__all__ = ['Base'] 