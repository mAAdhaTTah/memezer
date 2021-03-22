"""add procrastinate schema

Revision ID: bd1318844516
Revises: d96b2c13839a
Create Date: 2021-03-21 15:55:33.220019

"""
import importlib_resources

from alembic import op
from memezer.core.settings import settings

# revision identifiers, used by Alembic.
revision = "bd1318844516"
down_revision = "d96b2c13839a"
branch_labels = None
depends_on = None


def get_schema() -> str:
    return importlib_resources.read_text("procrastinate.sql", "schema.sql")


def upgrade() -> None:
    op.execute(f"CREATE SCHEMA IF NOT EXISTS {settings.QUEUE_SCHEMA}")
    op.execute(f"SET search_path TO {settings.QUEUE_SCHEMA}")
    op.execute(get_schema())
    op.execute(f"SET search_path TO {settings.APP_SCHEMA}")


def downgrade() -> None:
    op.execute(f"DROP SCHEMA {settings.QUEUE_SCHEMA}")
