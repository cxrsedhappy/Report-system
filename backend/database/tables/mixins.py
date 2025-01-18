from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column


class TimestampMixin:
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.now().replace(microsecond=0),
        onupdate=datetime.now().replace(microsecond=0),
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(default=datetime.now().replace(microsecond=0), nullable=False)
