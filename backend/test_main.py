import unittest
from fastapi.testclient import TestClient
from main import app
from typing import Dict

class TestAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.token = None

    def _get_auth_header(self) -> Dict[str, str]:
        if not self.token:
            self.test_login_success()
        return {"Authorization": f"Bearer {self.token}"}

    def test_login_success(self):
        credentials = {
            "login": "admin1234",
            "password": "admin1234"
        }
        response = self.client.post("/api/oauth2/authorize", json=credentials)
        self.assertEqual(response.status_code, 200)
        self.token = response.json()["access_token"]
        return self.token

    def test_create_user(self):
        user_data = {
            "login": "new_user",
            "password": "strongpassword",
            "name": "John",
            "surname": "Doe",
            "lastname": "Smith",
            "privilege": 1
        }
        response = self.client.post("/api/user", json=user_data)
        print(response.text)
        self.assertEqual(response.status_code, 201)
        self.assertIn("id", response.json())

    def test_get_users(self):
        headers = self._get_auth_header()
        response = self.client.get("/api/user", params={"user_id": 1}, headers=headers)
        self.assertEqual(response.status_code, 200)

    def test_protected_endpoint(self):
        headers = self._get_auth_header()
        response = self.client.get("/api/user/protected", headers=headers)
        self.assertEqual(response.status_code, 200)

    def test_create_student(self):
        student_data = {
            "educational_id": "ИК0001",
            "name": "Алиса",
            "surname": "Матвиенко",
            "lastname": None,
            "entrance": True
        }
        headers = self._get_auth_header()
        response = self.client.post("/api/student", json=student_data, headers=headers)
        print(response.text)
        self.assertEqual(response.status_code, 201)
        self.assertIn("id", response.json())

    # Group endpoints tests
    def test_create_group(self):
        group_data = {"name": "Group A"}
        headers = self._get_auth_header()
        response = self.client.post("/api/group", json=group_data, headers=headers)
        self.assertEqual(response.status_code, 201)
        self.assertIn("id", response.json())

    # Subject endpoints tests
    def test_get_subject(self):
        headers = self._get_auth_header()
        response = self.client.get("/api/subject", headers=headers)
        self.assertEqual(response.status_code, 200)

    # Negative tests
    def test_invalid_login(self):
        invalid_credentials = {
            "login": "wrong_user",
            "password": "wrong_password"
        }
        response = self.client.post("/api/oauth2/authorize", json=invalid_credentials)
        self.assertNotEqual(response.status_code, 200)

    def test_unauthorized_access(self):
        response = self.client.get("/api/user/protected")
        self.assertEqual(response.status_code, 401)

if __name__ == "__main__":
    unittest.main()