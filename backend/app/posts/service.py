from sqlalchemy.orm import Session
from app.posts import repository
from app.auth.component import get_active_user_or_raise

PAGE_SIZE = 20

def list_posts(db: Session, *, page: int, limit: int = PAGE_SIZE):
    total = repository.count_posts(db)
    posts = repository.find_posts(db, page=page, limit=limit)

    return {
        "items": posts,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (total + limit - 1) // limit
    }

def create_post(db: Session, *, user_id: int, title: str, content: str):
    get_active_user_or_raise(db, user_id=user_id)

    return repository.create_post(
        db,
        user_id=user_id,
        title=title,
        content=content
    )