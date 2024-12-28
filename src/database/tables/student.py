from __future__ import annotations

from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from src.database.tables import Base


class Student(Base):
    __tablename__ = 'students'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    educational_id: Mapped[str] = mapped_column(nullable=False)

    name: Mapped[str] = mapped_column(default="", nullable=False)
    surname: Mapped[str] = mapped_column(default="", nullable=False)
    last_name: Mapped[str] = mapped_column(default="", nullable=False)

    group_id: Mapped[int] = mapped_column(ForeignKey('groups.id'), nullable=True)
    group: Mapped[Group] = relationship(back_populates='students')

    def __str__(self):
        return f"<Student id={self.id}>"


class Group(Base):
    __tablename__ = 'groups'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(default="", nullable=False)

    students: Mapped[list[Student]] = relationship(back_populates="group")

    def __str__(self):
        return f"<Group id={self.id} name={self.name}>"


