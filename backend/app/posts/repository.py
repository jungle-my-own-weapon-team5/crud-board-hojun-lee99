from sqlalchemy.orm import Session
from app.models import Post

def count_posts(db: Session) -> int:
    return db.query(Post).filter(Post.deletedAt.is_(None)).count()