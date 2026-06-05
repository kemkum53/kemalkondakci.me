def test_login_success(client):
    res = client.post(
        "/api/auth/login", json={"username": "admin", "password": "test1234"}
    )
    assert res.status_code == 200
    body = res.json()
    assert body["accessToken"]
    assert body["tokenType"] == "bearer"


def test_login_wrong_password(client):
    res = client.post(
        "/api/auth/login", json={"username": "admin", "password": "yanlis"}
    )
    assert res.status_code == 401


def test_login_unknown_user(client):
    res = client.post(
        "/api/auth/login", json={"username": "baskasi", "password": "test1234"}
    )
    assert res.status_code == 401


def test_login_missing_fields(client):
    res = client.post("/api/auth/login", json={"username": "admin"})
    assert res.status_code == 422
