"""
요청 응답 모델
RegisterRequest
LoginRequest
TokenResponse
"""

from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    email: EmailStr
    nickname: str = Field(min_length=2, max_length=50)
    password: str = Field(min_length=8, max_length=72)