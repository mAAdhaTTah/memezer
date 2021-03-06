"""rename txt to output

Revision ID: 860accf7229f
Revises: 59cba140f2f8
Create Date: 2021-04-25 22:48:45.018922

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = "860accf7229f"
down_revision = "59cba140f2f8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("ocr_result", "txt", new_column_name="output")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("ocr_result", "output", new_column_name="txt")
    # ### end Alembic commands ###
