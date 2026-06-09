"""
비즈니스 로직
"""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.auth import repository
from app.auth.security import hash_password, verify_password, create_access_token


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

def login(db: Session, *, email:str, password:str):
    existing_user = repository.find_by_email(db, email)
    
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    if not verify_password(password, existing_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    access_token = create_access_token(existing_user.id)

    return access_token