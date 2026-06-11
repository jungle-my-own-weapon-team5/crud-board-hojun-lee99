from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.posts import service
from app.posts.schemas import PostListResponse, PostCreateRequest, PostUpdateRequest, PostDetailResponse
from app.auth.dependencies import get_current_user_id


router = APIRouter()

@router.get("", response_model=PostListResponse)
def list_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=20),
    db: Session = Depends(get_db)
):
    return service.list_posts(db, page=page, limit=limit)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_post(
    req: PostCreateRequest,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    post = service.create_post(
        db,
        user_id=current_user_id,
        title=req.title,
        content=req.content
    )

    return post

@router.put("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def update_post(
    post_id: int,
    req: PostUpdateRequest,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    service.update_post(
        db,
        post_id=post_id,
        user_id=current_user_id,
        title=req.title,
        content=req.content,
    )

@router.get("/{post_id}", response_model=PostDetailResponse)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
):
    return service.get_post(db, post_id=post_id)