from sqlalchemy.orm import mapped_column, Mapped

from src.database.tables.base import Base
from src.database.tables.mixins import TimestampMixin

class User(Base, TimestampMixin):
    """
    Table: Users\n
    id          - Users ID\n
    password    - Hashed Password\n
    privilege   - Privilege level (User: 0, Administrator: 1). Will be added more **privilege levels**\n

    name, surname, lastname - User's data


    """
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    login: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)

    name: Mapped[str] = mapped_column(nullable=False)
    surname: Mapped[str] = mapped_column(nullable=False)
    lastname: Mapped[str] = mapped_column(nullable=False)

    privilege: Mapped[int] = mapped_column(default=0, nullable=False)

    def __repr__(self):
        return f"<User id={self.id} surname={self.surname} privilege={self.privilege}>"
