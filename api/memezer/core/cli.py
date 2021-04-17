import importlib

from typer import Typer, echo

from .db import session

cli = Typer()

SHELL_IMPORTS = [
    ("core.queue", ["queue"]),
    ("core.settings", ["settings"]),
    ("meme.models", ["Meme", "OCRResult"]),
    ("meme.tasks", ["ocr_meme"]),
    ("user.models", ["User"]),
]


@cli.command("shell")
def shell() -> None:
    from IPython import start_ipython

    with session() as db:
        imported_objects = {"db": db}

        for pkg, objs in SHELL_IMPORTS:
            module = importlib.import_module(f"memezer.{pkg}")
            imported_objects |= {obj: getattr(module, obj) for obj in objs}

        start_ipython(argv=[], user_ns=imported_objects)


@cli.command("start")
def start() -> None:
    echo("TODO: Start server")


@cli.command("upgrade")
def upgrade() -> None:
    echo("TODO: upgrade application")
