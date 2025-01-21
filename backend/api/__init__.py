__all__ = {
    'user_router',
    'auth_router',
    'student_router',
    'subject_router'
}

from backend.api.user import user_router
from backend.api.auth import auth_router
from backend.api.student import student_router
from backend.api.subject import subject_router
