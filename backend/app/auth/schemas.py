"""
요청 응답 모델
RegisterRequest
LoginRequest
TokenResponse
"""

from pydantic import BaseModel, EmailStr, Field, ConfigDict

class RegisterRequest(BaseModel):
    email: EmailStr
    nickname: str = Field(min_length=2, max_length=50)
    password: str = Field(min_length=8, max_length=72)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type:str = "bearer"

class MeResponse(BaseModel):
    id: int
    email: str
    nickname: str
    
    model_config = ConfigDict(from_attributes=True)