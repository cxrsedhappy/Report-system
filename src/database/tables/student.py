from __future__ import annotations

from sqlalchemy.orm import mapped_column, Mapped

from src.database.engine import Base


class Student(Base):
    __tablename__ = 'students'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(default="", nullable=False)

    def __str__(self):
        return f"<Student id={self.id}>"



