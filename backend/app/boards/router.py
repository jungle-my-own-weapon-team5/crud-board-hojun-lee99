from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.boards import service
from app.boards.schemas import BoardListItem, BoardListResponse

router = APIRouter()

@router.get("", response_model=BoardListResponse)
def list_boards(db: Session = Depends(get_db)):
    boards = service.list_boards(db)

    items = [
        BoardListItem.model_validate(board) for board in boards
    ]

    return BoardListResponse(items=items, total=len(items))
