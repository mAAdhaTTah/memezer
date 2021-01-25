from pathlib import Path

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .auth.router import router as auth_router
from .meme.router import router as meme_router
from .user.router import router as user_router

app_path = Path(__file__).parent.parent

assert app_path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)
api_router.include_router(meme_router)
api_router.include_router(user_router)

app.include_router(api_router)

build_path = app_path / "build"

if not build_path.exists():
    build_path.mkdir()

app.mount("/", StaticFiles(directory=str(build_path), html=True), name="build")
