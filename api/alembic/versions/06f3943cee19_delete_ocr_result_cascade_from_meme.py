"""delete ocr_result cascade from meme

Revision ID: 06f3943cee19
Revises: 860accf7229f
Create Date: 2021-05-01 01:33:15.702530

"""

from alembic import op

# revision identifiers, used by Alembic.
revision = "06f3943cee19"
down_revision = "860accf7229f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint("ocr_result_meme_id_fkey", "ocr_result", type_="foreignkey")
    op.create_foreign_key(
        None, "ocr_result", "memes", ["meme_id"], ["id"], ondelete="CASCADE"
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "ocr_result", type_="foreignkey")
    op.create_foreign_key(
        "ocr_result_meme_id_fkey", "ocr_result", "memes", ["meme_id"], ["id"]
    )
    # ### end Alembic commands ###
