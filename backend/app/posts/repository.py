from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.models import Post


def count_posts(db: Session, *, board_id: int | None = None) -> int:
    query = db.query(Post).filter(Post.deleted_at.is_(None))

    if board_id is not None:
        query = query.filter(Post.board_id == board_id)

    return query.count()

def find_posts(db: Session, *, page: int, limit: int, board_id: int | None = None) -> list[Post]:
    offset = (page - 1) * limit

    query = db.query(Post).filter(Post.deleted_at.is_(None))

    if board_id is not None:
        query = query.filter(Post.board_id == board_id)

    return (
        query
        .order_by(Post.created_at.desc(), Post.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

def create_post(
        db: Session,
        *,
        board_id: int,
        user_id: int,
        title: str,
        content: str,
) -> Post:
    post = Post(
        board_id=board_id,
        user_id=user_id,
        title=title,
        content=content,
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return post

def find_post_by_id(db: Session, post_id: int) -> Post | None:
    return (
        db.query(Post)
        .filter(Post.id == post_id, Post.deleted_at.is_(None))
        .first()
    )

def update_post(
    db: Session,
    *,
    post: Post,
    title: str,
    content: str,
) -> None:
    post.title = title
    post.content = content

    db.commit()
    db.refresh(post)

    return

def delete_post(
        db: Session,
        *,
        post: Post,
) -> None:
    post.deleted_at = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(post)

    return