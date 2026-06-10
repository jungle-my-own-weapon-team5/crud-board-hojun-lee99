from sqlalchemy.orm import Session
from app.posts import repository

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