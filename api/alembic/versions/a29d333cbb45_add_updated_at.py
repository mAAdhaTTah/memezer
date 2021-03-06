"""add updated at

Revision ID: a29d333cbb45
Revises: 086563cf5438
Create Date: 2021-03-28 01:25:21.879569

"""
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "a29d333cbb45"
down_revision = "086563cf5438"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "memes", sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False)
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("memes", "updated_at")
    # ### end Alembic commands ###
