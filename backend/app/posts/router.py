from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.posts import service as posts_service
from app.comments import service as comments_service
from app.posts.schemas import PostListResponse, PostCreateRequest, PostUpdateRequest, PostDetailResponse
from app.comments.schemas import CommentListResponse
from app.auth.dependencies import get_current_user_id


router = APIRouter()

@router.get("", response_model=PostListResponse)
def list_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=20),
    board_id: int | None = Query(None, ge=1),
    db: Session = Depends(get_db)
):
    return posts_service.list_posts(db, page=page, limit=limit, board_id=board_id)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_post(
    req: PostCreateRequest,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    post = posts_service.create_post(
        db,
        board_id=req.board_id,
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
    posts_service.update_post(
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
    return posts_service.get_post(db, post_id=post_id)

@router.delete('/{post_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    posts_service.delete_post(
        db,
        post_id=post_id,
        user_id=current_user_id,
    )

@router.get("/{post_id}/comments", response_model=CommentListResponse)
def list_comments(
    post_id: int,
    db: Session = Depends(get_db),
):
    return comments_service.list_comments(db, post_id=post_id)