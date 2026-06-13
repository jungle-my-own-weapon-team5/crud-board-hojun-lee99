"""
controller
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.auth import service
from app.auth.schemas import RegisterRequest, LoginRequest, LoginResponse, MeResponse
from app.database import get_db
from app.auth.component import get_active_user_or_raise
from app.auth.dependencies import get_current_user_id


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

@router.post(
    "/login",
    response_model=LoginResponse
)
def login(req:LoginRequest, db: Session = Depends(get_db)):
    access_token = service.login(db, email=req.email, password=req.password)
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.get("/me", response_model=MeResponse)
def me(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return get_active_user_or_raise(db, user_id=current_user_id)