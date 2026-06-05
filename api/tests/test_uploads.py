import io

PNG_BYTES = b"\x89PNG\r\n\x1a\n fake-image-content"


def _png():
    return io.BytesIO(PNG_BYTES)


def test_upload_requires_auth(client):
    res = client.post(
        "/api/admin/uploads",
        files={"file": ("x.png", _png(), "image/png")},
    )
    assert res.status_code == 401


def test_upload_and_serve(client, auth_headers):
    res = client.post(
        "/api/admin/uploads",
        files={"file": ("x.png", _png(), "image/png")},
        headers=auth_headers,
    )
    assert res.status_code == 200
    location = res.json()["location"]
    assert location.startswith("/api/media/")

    filename = location.rsplit("/", 1)[-1]
    served = client.get(f"/api/media/{filename}")
    assert served.status_code == 200
    assert served.headers["content-type"] == "image/png"
    assert served.content == PNG_BYTES


def test_upload_rejects_non_image(client, auth_headers):
    res = client.post(
        "/api/admin/uploads",
        files={"file": ("x.txt", io.BytesIO(b"hello"), "text/plain")},
        headers=auth_headers,
    )
    assert res.status_code == 415


def test_media_404_for_missing(client):
    assert client.get("/api/media/yok.png").status_code == 404
