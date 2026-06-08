"""
controller
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.auth import service
from app.auth.schemas import RegisterRequest
from app.database import get_db


router = APIRouter()

@router.post(
        "/register",
        status_code=status.HTTP_201_CREATED,
)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    # service에 가입 처리 로직 호출
    service.register(
        db, 
        email=req.email,
        nickname=req.nickname,
        password=req.password,
    )
    return {"message": "registered"}