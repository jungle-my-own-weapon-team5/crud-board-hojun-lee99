"""
비즈니스 로직
"""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.auth import repository
from backend.app.auth.security import hash_password


def register(
        db: Session,
        *,
        email: str,
        nickname: str,
        password: str,
    ):
    existing_user = repository.find_by_email(db, email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    
    return repository.create_user(
        db=db,
        email=email,
        nickname=nickname,
        hashed_password=hash_password(password)
    )