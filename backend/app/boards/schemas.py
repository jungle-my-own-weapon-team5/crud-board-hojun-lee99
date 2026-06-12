from datetime import datetime
from pydantic import BaseModel, ConfigDict

class BoardListItem(BaseModel):
    id: int
    name: str
    description: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BoardListResponse(BaseModel):
    items: list[BoardListItem]
    total: int