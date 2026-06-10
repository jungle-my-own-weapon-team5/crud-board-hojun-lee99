from sqlalchemy.orm import Session
from app.models import Post

def count_posts(db: Session) -> int:
    return db.query(Post).filter(Post.deleted_at.is_(None)).count()

def find_posts(db: Session, *, page: int, limit: int) -> list[Post]:
    offset = (page - 1) * limit

    return (
        db.query(Post)
        .filter(Post.deleted_at.is_(None))
        .order_by(Post.created_at.desc(), Post.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

def create_post(
        db: Session,
        *,
        user_id: int,
        title: str,
        content: str,
) -> Post:
    post = Post(
        user_id=user_id,
        title=title,
        content=content,
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return post