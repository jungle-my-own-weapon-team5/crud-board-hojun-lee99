from sqlalchemy.orm import Session

from app.models import Board

def find_boards(db: Session) -> list[Board]:
    return (
        db.query(Board)
        .filter(Board.deleted_at.is_(None))
        .order_by(Board.id.asc())
        .all()
    )