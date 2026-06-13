from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.comments import repository as comments_repository
from app.posts import repository as posts_repository
from app.auth.component import get_active_user_or_raise

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
    
def create_comment(db: Session, *, post_id: int, user_id: int, content: str):
    get_active_user_or_raise(db, user_id=user_id)

    post = posts_repository.find_post_by_id(db, post_id)
    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )
    
    return comments_repository.create_comment(
        db,
        post_id=post_id,
        user_id=user_id,
        content=content,
    )

def update_comment(db: Session, *, comment_id: int, user_id: int, content: str):
    get_active_user_or_raise(db, user_id=user_id)

    comment = comments_repository.find_comment_by_id(db, comment_id)

    if comment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found",
        )
    
    if comment.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own comment",
        )
    
    return comments_repository.update_comment(
        db,
        comment=comment,
        content=content,
    )

def delete_comment(db: Session, *, comment_id: int, user_id: int):
    get_active_user_or_raise(db, user_id=user_id)

    comment = comments_repository.find_comment_by_id(db, comment_id)

    if comment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found",
        )
    
    if comment.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own comment",
        )
    
    comments_repository.delete_comment(db, comment=comment)

    return