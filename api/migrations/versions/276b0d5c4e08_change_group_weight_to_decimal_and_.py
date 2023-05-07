"""Change group weight to decimal and truncate final grade

Revision ID: 276b0d5c4e08
Revises: 7a07d11f6bfe
Create Date: 2023-05-06 18:22:57.634743

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '276b0d5c4e08'
down_revision = '7a07d11f6bfe'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('group', schema=None) as batch_op:
        batch_op.alter_column('weight',
               existing_type=sa.INTEGER(),
               type_=sa.Numeric(precision=5, scale=2),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('group', schema=None) as batch_op:
        batch_op.alter_column('weight',
               existing_type=sa.Numeric(precision=5, scale=2),
               type_=sa.INTEGER(),
               existing_nullable=True)

    # ### end Alembic commands ###
