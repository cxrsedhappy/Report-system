from __future__ import annotations

from datetime import datetime
from email.policy import default

from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy_serializer import SerializerMixin

from backend.database.tables import Base
from backend.database.tables.mixins import TimestampMixin

class Student(Base, TimestampMixin, SerializerMixin):
    __tablename__ = 'students'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    educational_id: Mapped[str] = mapped_column(nullable=False)

    name: Mapped[str] = mapped_column(default="", nullable=False)
    surname: Mapped[str] = mapped_column(default="", nullable=False)
    lastname: Mapped[str] = mapped_column(default="", nullable=True)
    phone: Mapped[str] = mapped_column(default="", nullable=True)

    entrance: Mapped[bool] = mapped_column(default=False, nullable=True)

    # При удалении группы студенты не удаляются
    group_id: Mapped[int] = mapped_column(
        ForeignKey('groups.id', ondelete="SET NULL", name="FK_student_group"),
        nullable=True
    )
    group: Mapped[Group] = relationship(back_populates='students', lazy='selectin')

    # При удалении студента диплом удаляется
    diploma: Mapped[Diploma] = relationship(back_populates='student', cascade="all, delete", lazy='selectin')

    # При удалении студента экзамены удаляются
    exams: Mapped[list[Exam]] = relationship(
        back_populates='student',
        cascade="all, delete-orphan",
        lazy='selectin'
    )

    def __str__(self):
        return f"<Student id={self.id} name={self.name}>"


class Group(Base, TimestampMixin, SerializerMixin):
    __tablename__ = 'groups'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(default="", nullable=False)

    # При удалении группы студенты не удаляются
    students: Mapped[list[Student]] = relationship(
        back_populates="group",
        passive_deletes=True,
        lazy='selectin'
    )

    def __str__(self):
        return f"<Group id={self.id} name={self.name}>"


class Diploma(Base, TimestampMixin, SerializerMixin):
    __tablename__ = 'diplomas'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    student_id: Mapped[int] = mapped_column(
        ForeignKey('students.id', ondelete="CASCADE", name='FK_diploma_student'),
        nullable=True
    )
    student: Mapped[Student] = relationship(back_populates='diploma', lazy='selectin')

    assignment: Mapped[str] = mapped_column(default="", nullable=True)
    title: Mapped[bool] = mapped_column(default=False, nullable=True)

    chapters: Mapped[int] = mapped_column(default=0, nullable=True)
    originality: Mapped[int] = mapped_column(default=0, nullable=True)

    def __str__(self):
        return f"Diploma id={self.id} assignment={self.assignment} title={self.title}"


class Exam(Base, TimestampMixin, SerializerMixin):
    __tablename__ = 'exams'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    student_id: Mapped[int] = mapped_column(
        ForeignKey('students.id', ondelete="CASCADE", name='FK_exam_student'),
        nullable=True
    )
    student: Mapped[Student] = relationship(back_populates='exams', lazy='selectin')

    subject_id: Mapped[int] = mapped_column(
        ForeignKey('subjects.id', ondelete="CASCADE", name='FK_exam_subject'),
        default="",
        nullable=True
    )
    semester: Mapped[int] = mapped_column(default=1, nullable=True)
    year: Mapped[datetime] = mapped_column(default=datetime.now(), nullable=True)
    score: Mapped[int] = mapped_column(default=0, nullable=True)

    def __str__(self):
        return f"Exam id={self.id} subject={self.subject_id} score={self.score}"


class Subject(Base, TimestampMixin, SerializerMixin):
    __tablename__ = 'subjects'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(default="", nullable=False)

    def __str__(self):
        return f"Subject id={self.id} name={self.name}"