from typing import Optional, List

from fastapi import HTTPException, status

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.api.student.models import StudentModel, CreateStudentModel, UpdateStudentModel, InfoStudentModel
from backend.database.tables import Student

# Константы уровней привилегий
GUEST_PRIVILEGE = 0
TEACHER_PRIVILEGE = 1
ADMIN_PRIVILEGE = 2


async def create_student(student: CreateStudentModel, session: AsyncSession, current_user: dict) -> StudentModel:
    """
    Создает нового студента.

    Требует права преподавателя/администратора. Проверяет уникальность educational_id.

    Args:
        student: Модель данных для создания студента
        session: Асинхронная сессия SQLAlchemy
        current_user: Данные текущего пользователя

    Returns:
        StudentModel: Созданный студент

    Raises:
        HTTPException: 403 - Недостаточно прав
        HTTPException: 409 - Дублирование educational_id
    """
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Создание студентов запрещено для гостей"
        )

    # Проверка уникальности student.id
    # existing = await session.execute(select(Student).where(Student.login == student.login))

    # if existing.scalars().first():
    #     raise HTTPException(
    #         status_code=status.HTTP_409_CONFLICT,
    #         detail=f"Студент с id={student.id} уже существует"
    #     )

    new_student = Student(**student.model_dump())
    session.add(new_student)
    await session.commit()
    await session.refresh(new_student)
    return StudentModel.model_validate(new_student)


async def get_student(
        student_id: Optional[int] = None,
        session: AsyncSession = None,
        current_user: dict = None
) -> List[InfoStudentModel]:
    """
    Получает студентов с расширенной информацией.

    Args:
        student_id: ID студента (None для всех)
        session: Асинхронная сессия
        current_user: Данные пользователя

    Returns:
        List[InfoStudentModel]: Список студентов с группами, дипломами и экзаменами

    Raises:
        HTTPException: 403 - Недостаточно прав
        HTTPException: 404 - Студент не найден
    """
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Просмотр данных студентов запрещен для гостей"
        )

    query = select(Student).options(
        selectinload(Student.group),
        selectinload(Student.diploma),
        selectinload(Student.exams)
    )

    if student_id:
        query = query.where(Student.id == student_id)
        result = await session.execute(query)
        student = result.scalars().first()
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Студент с ID {student_id} не найден")

        return [InfoStudentModel(
            id=student.id,
            educational_id=student.educational_id,
            name=student.name,
            surname=student.surname,
            lastname=student.lastname,
            entrance=bool(student.entrance),
            group=student.group.name if student.group else None,
            diploma=student.diploma.title if student.diploma else None,
            exams=len(student.exams)
        )]

    results = await session.execute(query.order_by(Student.id))
    return [
        InfoStudentModel(
            id=s.id,
            educational_id=s.educational_id,
            name=s.name,
            surname=s.surname,
            lastname=s.lastname,
            entrance=bool(s.entrance),
            group=s.group.name if s.group else None,
            diploma=s.diploma.title if s.diploma else None,
            exams=len(s.exams)
        ) for s in results.scalars().all()
    ]


async def update_student(updates: List[UpdateStudentModel], session: AsyncSession, current_user: dict) -> dict:
    """
    Пакетное обновление студентов.

    Args:
        updates: Список обновлений
        session: Асинхронная сессия
        current_user: Данные пользователя

    Returns:
        dict: Статус операции

    Raises:
        HTTPException: 403 - Недостаточно прав
        HTTPException: 404 - Студент не найден
        HTTPException: 409 - Дублирование educational_id
    """
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Обновление студентов запрещено для гостей"
        )

    _ = await session.execute(select(Student.id))

    existing_ids = {s for s in _.scalars().all()}
    update_ids = {u.id for u in updates}

    # Проверка существования всех студентов
    missing = update_ids - existing_ids
    if missing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Студенты с ID {missing} не найдены"
        )

    # Проверка уникальности student.id
    for upd in updates:
        if upd.id:
            existing = await session.execute(
                select(Student.id).where(Student.id == upd.id)
            )
            existing = existing.scalars().first()
            if existing and existing != upd.id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"ID {upd.id} уже занят"
                )

    # Пакетное обновление
    for upd in updates:
        values = upd.model_dump(exclude_unset=True)
        await session.execute(
            update(Student)
            .where(Student.id == upd.id)
            .values(**values)
        )

    await session.commit()
    return {"status": "success", "updated": len(updates)}


async def delete_student(student_ids: List[int], session: AsyncSession, current_user: dict) -> dict:
    """
    Удаляет студентов по ID.

    Args:
        student_ids: Список ID студентов
        session: Асинхронная сессия
        current_user: Данные пользователя

    Returns:
        dict: Статус операции

    Raises:
        HTTPException: 403 - Недостаточно прав
        HTTPException: 404 - Студенты не найдены
    """
    if current_user.get('privilege') == GUEST_PRIVILEGE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Удаление студентов запрещено для гостей"
        )

    _ = await session.execute(select(Student.id))
    existing = set(_.scalars().all())
    to_delete = set(student_ids)

    missing = to_delete - existing
    if missing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Студенты с ID {missing} не найдены"
        )

    await session.execute(delete(Student).where(Student.id.in_(student_ids)))
    await session.commit()
    return {"status": "success", "deleted": len(student_ids)}