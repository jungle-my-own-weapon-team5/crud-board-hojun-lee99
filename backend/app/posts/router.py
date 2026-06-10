from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.posts import service
from app.posts.schemas import PostListResponse

router = APIRouter()

@router.get("", response_model=PostListResponse)
def list_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=20),
    db: Session = Depends(get_db)
):
    return service.list_posts(db, page=page, limit=limit)