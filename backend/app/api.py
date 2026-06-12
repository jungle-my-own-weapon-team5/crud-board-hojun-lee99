from fastapi import APIRouter

from app.auth.router import router as auth_router
from app.posts.router import router as posts_router
from app.boards.router import router as boards_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix='/auth', tags=["auth"])
api_router.include_router(posts_router, prefix='/posts', tags=["posts"])
api_router.include_router(boards_router, prefix='/boards', tags=["boards"])