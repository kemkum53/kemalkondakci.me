import os
import tempfile

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.config import settings
from app.database import Base, get_db
from app.security import hash_password

# Test için dosya-tabanlı geçici SQLite (bağlantı/thread'ler arası güvenilir paylaşım).
_db_fd, _db_path = tempfile.mkstemp(suffix=".db")
os.close(_db_fd)
engine = create_engine(
    f"sqlite:///{_db_path}",
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def _override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture(autouse=True)
def _setup(tmp_path):
    # Bilinen test kimlik bilgileri + izole yükleme dizini.
    settings.admin_username = "admin"
    settings.admin_password_hash = hash_password("test1234")
    settings.jwt_secret = "test-jwt-secret-at-least-32-characters-long"
    settings.uploads_dir = str(tmp_path / "uploads")

    # Login rate-limiter bellek-içi singleton; testler arası sızmasın.
    from app.routers.auth import _limiter

    _limiter._fails.clear()
    _limiter._blocked.clear()

    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def auth_headers(client):
    res = client.post(
        "/api/auth/login", json={"username": "admin", "password": "test1234"}
    )
    assert res.status_code == 200
    return {"Authorization": f"Bearer {res.json()['accessToken']}"}
