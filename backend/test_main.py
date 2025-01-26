from pycparser.ply.yacc import token

from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def get_bearer():
    response = client.post(
        "/api/oauth2/authorize",
        json={
            "login": "admin1234",
            "password": "admin1234"
        }
    )
    return response.text, response.cookies['access_token']

def get_users(token: str, users_id: int = None):
    response = client.get(
        "/api/user",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )
    return response

def update_user(token: str):
    response = client.put(
        "/api/user",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "user_id": 4,
            "name": "СтанислаV"
        }
    )
    return response.json()

def create_group(name: str, token: str):
    response = client.post(
        "/api/group",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "name": f"{name}"
        }
    )
    return response.json()

def create_student(token: str):
    ...

def add_student_to_group(s_id: int, g_id: int, token: str):
    ...


if __name__ == '__main__':
    bearer, token_model = get_bearer()
    print(token_model.split()[0].strip())
    print(create_group("ИКБО-05-21", token_model.split()[0].strip()))
