from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.comments import repository as comments_repository
from app.posts import repository as posts_repository

def list_comments(db: Session, *, post_id: int):
    post = posts_repository.find_post_by_id(db, post_id)

    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )
    
    comments = comments_repository.find_comments_by_post_id(db, post_id)

    return {
        "items": comments,
        "total": len(comments),
    }