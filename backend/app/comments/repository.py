from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.models import Comment

def find_comments_by_post_id(db: Session, post_id: int) -> list[Comment]:
    return (
        db.query(Comment)
        .filter(Comment.post_id == post_id, Comment.deleted_at.is_(None))
        .order_by(Comment.created_at.asc(), Comment.id.asc())
        .all()
    )

def create_comment(db: Session, *, post_id: int, user_id: int, content: str) -> Comment:
    comment = Comment(post_id=post_id, user_id=user_id, content=content)

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment

def find_comment_by_id(db: Session, comment_id: int) -> Comment | None:
    return (
        db.query(Comment)
        .filter(Comment.id == comment_id, Comment.deleted_at.is_(None))
        .first()
    )

def update_comment(db: Session, *, comment: Comment, content:str):
    comment.content = content

    db.commit()
    db.refresh(comment)

    return

def delete_comment(db: Session, *, comment: Comment) -> None:
    comment.deleted_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(comment)

    return