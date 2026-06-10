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


def test_login_rate_limited_after_too_many_failures(client):
    from app.config import settings

    # Eşik kadar başarısız deneme: hepsi 401.
    for _ in range(settings.login_max_attempts):
        r = client.post(
            "/api/auth/login", json={"username": "admin", "password": "yanlis"}
        )
        assert r.status_code == 401

    # Bir sonraki deneme kilitli: 429 + Retry-After.
    r = client.post(
        "/api/auth/login", json={"username": "admin", "password": "yanlis"}
    )
    assert r.status_code == 429
    assert r.headers.get("Retry-After")

    # Kilit süresince doğru şifre bile reddedilir.
    r = client.post(
        "/api/auth/login", json={"username": "admin", "password": "test1234"}
    )
    assert r.status_code == 429


def test_login_success_not_rate_limited(client):
    # Eşiğin altında birkaç başarısız deneme sonrası doğru şifre çalışmalı.
    for _ in range(3):
        client.post("/api/auth/login", json={"username": "admin", "password": "x"})
    res = client.post(
        "/api/auth/login", json={"username": "admin", "password": "test1234"}
    )
    assert res.status_code == 200
