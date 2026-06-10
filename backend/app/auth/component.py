from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import User
from app.auth.repository import find_by_id

def get_active_user_or_raise(db: Session, *, user_id: int) -> User:
    user = find_by_id(db, user_id)

    if user is None or user.deleted_at is not None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    return user