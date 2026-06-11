from datetime import datetime
from pydantic import BaseModel, ConfigDict

class PostListItem(BaseModel):
    id: int
    user_id: int
    title: str
    created_at: datetime
    updated_at: datetime

    # SQLAlchemy ORM 객체를 FastAPI 응답 모델로 변환할 수 있게 해주는 설정
    model_config = ConfigDict(from_attributes=True)

class PostListResponse(BaseModel):
    items: list[PostListItem]
    page: int
    limit: int
    total: int
    total_pages: int

class PostCreateRequest(BaseModel):
    title: str
    content: str

class PostUpdateRequest(BaseModel):
    title: str
    content: str
    
class PostDetailResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)