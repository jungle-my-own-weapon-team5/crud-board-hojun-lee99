from sqlalchemy.orm import Session

from app.boards import repository

def list_boards(db: Session):
    return repository.find_boards(db)