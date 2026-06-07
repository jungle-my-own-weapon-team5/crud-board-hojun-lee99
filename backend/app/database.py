import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session,sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://board_user:board_password@localhost:5432/board_db"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)

class Base(DeclarativeBase):
    pass

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()