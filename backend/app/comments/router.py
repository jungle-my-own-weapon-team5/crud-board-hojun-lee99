from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.comments import service as comments_service
from app.auth.dependencies import get_current_user_id

router = APIRouter()

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    comments_service.delete_comment(
        db,
        comment_id=comment_id,
        user_id=current_user_id,
    )
