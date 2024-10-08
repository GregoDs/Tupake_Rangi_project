"""Add image_url to Paint model

Revision ID: 4e2f9bd5400f
Revises: aad0ee0b7426
Create Date: 2024-08-08 18:20:34.951745

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4e2f9bd5400f'
down_revision = 'aad0ee0b7426'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('paint', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_url', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('paint', schema=None) as batch_op:
        batch_op.drop_column('image_url')

    # ### end Alembic commands ###
