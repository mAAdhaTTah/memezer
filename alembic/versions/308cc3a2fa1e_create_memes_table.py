"""Create memes table

Revision ID: 308cc3a2fa1e
Revises: 8697417b32da
Create Date: 2021-01-24 03:11:57.793824

"""
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision = "308cc3a2fa1e"
down_revision = "8697417b32da"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "memes",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("uploader_id", postgresql.UUID(), nullable=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("filename", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(
            ["uploader_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_memes_id"), "memes", ["id"], unique=True)
    op.create_index(
        op.f("ix_memes_uploader_id"), "memes", ["uploader_id"], unique=False
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_memes_uploader_id"), table_name="memes")
    op.drop_index(op.f("ix_memes_id"), table_name="memes")
    op.drop_table("memes")
    # ### end Alembic commands ###
