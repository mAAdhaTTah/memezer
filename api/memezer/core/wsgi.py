from pathlib import Path

from fastapi import APIRouter, FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from ..auth.router import router as auth_router
from ..core.queue import queue
from ..meme.errors import DuplicateFilenameException, MemeNotFound
from ..meme.router import router as meme_router
from ..user.errors import AuthenticationFailed
from ..user.router import router as user_router
from .fs import SaveMemeException
from .settings import settings

wsgi = FastAPI()

if settings.ENABLE_CORS:
    wsgi.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@wsgi.on_event("startup")
async def startup_event() -> None:
    await queue.open_async()


@wsgi.on_event("shutdown")
async def shutdown_event() -> None:
    await queue.close_async()


api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)
api_router.include_router(meme_router)
api_router.include_router(user_router)

wsgi.include_router(api_router)

app_path = Path(__file__).parent.parent.parent

assert app_path

build_path = app_path / "build"

if not build_path.exists():
    build_path.mkdir()

wsgi.mount(
    f"/{settings.MEDIA_SUBPATH}",
    StaticFiles(directory=str(settings.MEDIA_PATH), html=True),
    name="media",
)
wsgi.mount("/", StaticFiles(directory=str(build_path), html=True), name="build")


@wsgi.exception_handler(DuplicateFilenameException)
async def duplicate_filename_exception_handler(
    request: Request, err: DuplicateFilenameException
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"message": f"Filename {err.filename} already exists."},
    )


@wsgi.exception_handler(MemeNotFound)
async def no_results_exception_handler(
    request: Request, err: MemeNotFound
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"message": f"Meme {err.meme_id} not found."},
    )


@wsgi.exception_handler(SaveMemeException)
async def save_meme_exception_handler(
    request: Request, err: MemeNotFound
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "Failed to save."},
    )


@wsgi.exception_handler(AuthenticationFailed)
async def auth_failed_exception_hanlder(
    request: Request, err: AuthenticationFailed
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"message": "Username or password is incorrect."},
    )
