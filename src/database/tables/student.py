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
    lastname: Mapped[str] = mapped_column(default="", nullable=True)

    group_id: Mapped[int] = mapped_column(ForeignKey('groups.id'), nullable=True)
    group: Mapped[Group] = relationship(back_populates='students')

    diploma_id: Mapped[int] = mapped_column(ForeignKey('diplomas.id'), nullable=True)
    diploma: Mapped[Diploma] = relationship(back_populates='student')

    exam_id: Mapped[int] = mapped_column(ForeignKey('exams.id'), nullable=True)
    exam: Mapped[Exam] = relationship(back_populates='student')

    def __str__(self):
        return f"<Student id={self.id}>"


class Group(Base):
    __tablename__ = 'groups'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(default="", nullable=False)

    students: Mapped[list[Student]] = relationship(back_populates="group")

    def __str__(self):
        return f"<Group id={self.id} name={self.name}>"


class Diploma(Base):
    __tablename__ = 'diplomas'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    student_id: Mapped[int] = mapped_column(ForeignKey('students.id'), nullable=True)
    student: Mapped[Student] = relationship(back_populates='diploma')

    assignment: Mapped[str] = mapped_column(default="", nullable=True)
    title: Mapped[str] = mapped_column(default="", nullable=True)

    chapters: Mapped[int] = mapped_column(default="", nullable=True)
    originality: Mapped[int] = mapped_column(default="", nullable=True)

    def __str__(self):
        return f"<Diploma id={self.id} title={self.title}>"


class Exam(Base):
    __tablename__ = 'exams'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    student_id: Mapped[int] = mapped_column(ForeignKey('students.id'), nullable=True)
    student: Mapped[Student] = relationship(back_populates='exam')

    name: Mapped[str] = mapped_column(default="", nullable=True)
    semester: Mapped[int] = mapped_column(default="", nullable=True)
    year: Mapped[int] = mapped_column(default="", nullable=True)


    def __str__(self):
        return f"<Diploma id={self.id} name={self.name}>"


