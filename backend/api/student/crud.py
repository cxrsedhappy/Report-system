from click import group
from fastapi import HTTPException

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.student.models import StudentModel, CreateStudentModel, UpdateStudentModel, InfoStudentModel
from backend.database.tables import User, Student

# 2 - Гульнара Рифовна
# 1 - Преподаватели
# 0 - Гости

async def create_student(student: CreateStudentModel, session: AsyncSession, current_user) -> StudentModel:
    if current_user.get('privilege') == 0:
        raise HTTPException(403, detail="You don't have rights to create student")

    new_student = Student(
        educational_id=student.educational_id,
        name=student.name,
        surname=student.surname,
        lastname=student.lastname,
        entrance=student.entrance
    )

    session.add(new_student)
    await session.commit()
    await session.refresh(new_student)
    return StudentModel.model_validate(new_student)


async def get_student(student_id: int | None, session: AsyncSession, current_user) -> list[InfoStudentModel]:
    if current_user.get('privilege') == 0:
        raise HTTPException(403, detail="You don't have rights to get student")

    if student_id is None:
        statement = select(Student).order_by(Student.id)
    else:
        statement = select(Student).where(Student.id == student_id).order_by(Student.id)

    result = await session.execute(statement)
    students = result.scalars().all()
    return [
        InfoStudentModel(
            id=_.id,
            educational_id=_.educational_id,
            name=_.name,
            surname=_.surname,
            lastname=_.lastname,
            entrance=_.entrance,
            group=_.group.name if _.group is not None else "Нет группы",
            diploma=_.diploma.title if _.diploma is not None else "Нет темы",
            exams=len(_.exams)
        ) for _ in students
    ]


async def update_student(user_ids: list[int], session, current_user):
    ...


async def delete_student(student_ids: list[int], session: AsyncSession, current_user):
    if current_user.get('privilege') == 0:
        raise HTTPException(403, detail="You don't have rights to delete student")

    statement = delete(Student).where(Student.id.in_(student_ids))
    await session.execute(statement)
    await session.commit()
    return {"status": "success"}