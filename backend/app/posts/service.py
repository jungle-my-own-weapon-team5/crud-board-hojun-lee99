from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.posts import repository
from app.auth.component import get_active_user_or_raise

PAGE_SIZE = 20

def list_posts(db: Session, *, page: int, limit: int = PAGE_SIZE, board_id: int | None = None):
    total = repository.count_posts(db, board_id=board_id)
    posts = repository.find_posts(db, page=page, limit=limit, board_id=board_id)

    return {
        "items": posts,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (total + limit - 1) // limit
    }

def create_post(db: Session, *, board_id:int, user_id: int, title: str, content: str):
    get_active_user_or_raise(db, user_id=user_id)

    return repository.create_post(
        db,
        board_id=board_id,
        user_id=user_id,
        title=title,
        content=content
    )

def update_post(
    db: Session,
    *,
    post_id: int,
    user_id: int,
    title: str,
    content: str,
):
    get_active_user_or_raise(db, user_id=user_id)

    post = repository.find_post_by_id(db, post_id)

    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )
    
    if post.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own post",
        )
    
    repository.update_post(
        db,
        post=post,
        title=title,
        content=content,
    )

    return

def get_post(db: Session, *, post_id: int):
    post = repository.find_post_by_id(db, post_id)

    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )
    
    return post

def delete_post(
    db: Session,
    *,
    post_id: int,
    user_id: int,
):
    get_active_user_or_raise(db, user_id=user_id)
    
    post = repository.find_post_by_id(db, post_id)
    
    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )
    
    if post.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own post",
        )
    
    repository.delete_post(
        db,
        post=post,
    )

    return