from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def get_bearer():
    response = client.post(
        "/api/oauth2/authorize",
        json={
            "login": "string",
            "password": "stringst"
        }
    )
    return response.cookies['access_token']

def update_user(token: str):
    response = client.put(
        "/api/user",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "user_id": 4,
            "name": "Станислав"
        }
    )
    return response.json()

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Ping": "Pong"}

if __name__ == '__main__':
    bearer = get_bearer()
    print(update_user(bearer))