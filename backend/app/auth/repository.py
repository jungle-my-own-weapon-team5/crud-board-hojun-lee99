"""
db 접근
"""
from sqlalchemy.orm import Session

from app.models import User

def find_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(
        db: Session,
        email: str,
        nickname: str,
        hashed_password: str,
) -> User:
    user = User(
        email=email,
        nickname=nickname,
        hashed_password=hashed_password,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def find_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()