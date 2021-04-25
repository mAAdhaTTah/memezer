from enum import Enum
from typing import Any

from typer import Argument, Typer

cli = Typer()


@cli.command("shell")
def shell() -> None:
    """
    Open up a iPython shell in the memezer context.
    """
    import importlib

    from IPython import start_ipython

    from .db import session

    SHELL_IMPORTS = [
        ("core.queue", ["queue"]),
        ("core.settings", ["settings"]),
        ("meme.models", ["Meme", "OCRResult"]),
        ("meme.tasks", ["ocr_meme"]),
        ("user.models", ["User"]),
    ]

    with session() as db:
        imported_objects = {"db": db}

        for pkg, objs in SHELL_IMPORTS:
            module = importlib.import_module(f"memezer.{pkg}")
            imported_objects |= {obj: getattr(module, obj) for obj in objs}

        start_ipython(argv=[], user_ns=imported_objects)


class Service(str, Enum):
    wsgi = "wsgi"
    worker = "worker"


@cli.command("start")
def start(service: Service = Argument(..., help="Which service to start")) -> None:
    """
    Start one of the memezer services.
    """
    if service == Service.wsgi:
        import sys
        import time
        from signal import SIGINT, SIGTERM, signal
        from subprocess import Popen

        run_args = [
            "gunicorn",
            "-k",
            "uvicorn.workers.UvicornWorker",
            "--config",
            "gunicorn.conf.py",
            "memezer.app:wsgi",
        ]
        gunicorn_master_proc = Popen(run_args)

        def kill_proc(signum: Any, frame: Any) -> None:
            gunicorn_master_proc.terminate()
            gunicorn_master_proc.wait()
            sys.exit(0)

        signal(SIGINT, kill_proc)
        signal(SIGTERM, kill_proc)

        while True:
            time.sleep(1)

    if service == Service.worker:
        from .queue import queue

        with queue.open():
            queue.run_worker()  # type: ignore


@cli.command("upgrade")
def upgrade() -> None:
    """
    Update the memezer database to the latest version.
    """
    from alembic.config import CommandLine

    CommandLine(prog="alembic").main(argv=["upgrade", "head"])
