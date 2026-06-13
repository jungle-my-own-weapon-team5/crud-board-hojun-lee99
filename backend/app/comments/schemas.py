from datetime import datetime
from pydantic import BaseModel, ConfigDict, field_validator

class CommentListItem(BaseModel):
    id: int
    post_id: int
    user_id: int
    content: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
    
class CommentListResponse(BaseModel):
    items: list[CommentListItem]
    total: int

class CommentCreateRequest(BaseModel):
    content: str

    @field_validator("content")
    @classmethod
    def validate_content(cls, value:str):
        content = value.strip()
        if not content:
            raise ValueError("댓글 내용을 입력해주세요.")
        return content
    
class CommentCreateResponse(CommentListItem):
    pass

class CommentUpdateRequest(CommentCreateRequest):
    pass
