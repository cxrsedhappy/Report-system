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

if __name__ == '__main__':
    user_id, bearer = get_bearer()
    print(get_users(bearer))