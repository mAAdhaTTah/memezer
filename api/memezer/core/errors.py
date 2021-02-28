from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from ..meme.errors import DuplicateFilenameException


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(DuplicateFilenameException)
    async def duplicate_filename_exception_handler(
        request: Request, err: DuplicateFilenameException
    ) -> JSONResponse:
        return JSONResponse(
            status_code=409,
            content={"message": f"Filename {err.filename} already exists."},
        )
