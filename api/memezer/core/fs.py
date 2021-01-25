import os
from pathlib import Path

from fastapi import UploadFile


async def save_file(save_path: Path, file: UploadFile) -> None:
    if not save_path.parent.exists():
        os.makedirs(save_path.parent)

    contents = await file.read()

    with open(save_path, "xb") as f:
        f.write(contents.encode("utf-8") if isinstance(contents, str) else contents)
