VALID = {"name": "Kemal", "email": "k@example.com", "subject": "Selam",
         "message": "Bu yeterince uzun bir test mesajıdır."}


def test_contact_honeypot_silently_ok(client):
    # Honeypot (company) doluysa: SMTP'siz bile sessiz 200, e-posta gönderilmez.
    r = client.post("/api/contact", json={**VALID, "company": "spam-bot"})
    assert r.status_code == 200


def test_contact_not_configured_returns_503(client):
    # Test ayarlarında SMTP boş → 503.
    r = client.post("/api/contact", json=VALID)
    assert r.status_code == 503


def test_contact_validation_422(client):
    r = client.post("/api/contact", json={"name": "K", "email": "gecersiz", "message": "kısa"})
    assert r.status_code == 422


def test_contact_sends_when_configured(client, monkeypatch):
    from app.config import settings
    from app.routers import contact as c

    monkeypatch.setattr(settings, "smtp_host", "smtp.test")
    monkeypatch.setattr(settings, "smtp_user", "u@test")
    monkeypatch.setattr(settings, "smtp_password", "pw")
    c._limiter._fails.clear()
    c._limiter._blocked.clear()

    sent = {}
    monkeypatch.setattr(c, "_send_email", lambda data: sent.update(name=data.name, to_email=data.email))

    r = client.post("/api/contact", json=VALID)
    assert r.status_code == 200
    assert sent == {"name": "Kemal", "to_email": "k@example.com"}
