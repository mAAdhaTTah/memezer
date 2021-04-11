"""make accessibility_text TEXT column

Revision ID: 59cba140f2f8
Revises: a29d333cbb45
Create Date: 2021-04-11 03:36:47.448218

"""
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "59cba140f2f8"
down_revision = "a29d333cbb45"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "memes",
        "accessibility_text",
        existing_type=sa.VARCHAR(length=1024),
        type_=sa.Text(),
        existing_nullable=True,
    )
    op.alter_column(
        "ocr_result",
        "txt",
        existing_type=sa.VARCHAR(length=1024),
        type_=sa.Text(),
        existing_nullable=False,
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "ocr_result",
        "txt",
        existing_type=sa.Text(),
        type_=sa.VARCHAR(length=1024),
        existing_nullable=False,
    )
    op.alter_column(
        "memes",
        "accessibility_text",
        existing_type=sa.Text(),
        type_=sa.VARCHAR(length=1024),
        existing_nullable=True,
    )
    # ### end Alembic commands ###
