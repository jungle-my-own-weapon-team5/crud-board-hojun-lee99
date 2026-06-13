from sqlalchemy.orm import Session

from app.models import Comment

def find_comments_by_post_id(db: Session, post_id: int) -> list[Comment]:
    return (
        db.query(Comment)
        .filter(Comment.post_id == post_id, Comment.deleted_at.is_(None))
        .order_by(Comment.created_at.asc(), Comment.id.asc())
        .all()
    )