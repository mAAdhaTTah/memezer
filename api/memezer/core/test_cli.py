from typing import Any, List

from click.testing import Result
from typer.testing import CliRunner

from .cli import cli

runner = CliRunner()


def invoke(cmd: List[str], **kwargs: Any) -> Result:
    return runner.invoke(cli, cmd, **kwargs)


def test_shell() -> None:
    result = invoke(["shell"], input="exit()")

    assert result.exit_code == 0
    assert "In [1]:" in result.stdout


def test_upgrade() -> None:
    result = invoke(["upgrade"])

    assert result.exit_code == 0
    assert "[alembic.runtime.migration]" in result.stdout
