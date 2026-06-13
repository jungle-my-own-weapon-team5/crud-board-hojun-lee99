from datetime import datetime
from pydantic import BaseModel, ConfigDict

class CommentListItem(BaseModel):
    id: int
    post_id: int
    user_id: int
    content: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime

    model_config = ConfigDict(from_attributes=True)
    
class CommentListResponse(BaseModel):
    items: list[CommentListItem]
    total: int