from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Ping": "Pong"}

if __name__ == '__main__':
    test_read_main()