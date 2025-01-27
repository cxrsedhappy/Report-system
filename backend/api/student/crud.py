from fastapi import HTTPException

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.student.models import StudentModel, CreateStudentModel
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


async def get_student(student_id: int | None, session: AsyncSession, current_user) -> list[StudentModel]:
    if current_user.get('privilege') == 0:
        raise HTTPException(403, detail="You don't have rights to get student")

    if student_id is None:
        statement = select(Student).order_by(Student.id)
    else:
        statement = select(Student).where(Student.id == student_id).order_by(Student.id)

    result = await session.execute(statement)
    students = result.scalars().all()
    print(students)
    return [StudentModel.model_validate(student) for student in students]


async def update_student():
    ...


async def delete_student(student_ids: list[int], session: AsyncSession, current_user) -> bool:
    if current_user.get('privilege') == 0:
        raise HTTPException(403, detail="You don't have rights to delete student")

    statement = delete(Student).where(Student.id.in_(student_ids))
    await session.execute(statement)
    await session.commit()
    return True