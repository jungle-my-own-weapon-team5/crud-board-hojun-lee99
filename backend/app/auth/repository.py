"""
db 접근
"""
from sqlalchemy.orm import Session

from app.models import User

def find_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

