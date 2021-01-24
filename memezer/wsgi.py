from fastapi import FastAPI

from .auth.router import router as auth_router
from .meme.router import router as meme_router
from .user.router import router as user_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(meme_router)
app.include_router(user_router)
