from tests.helpers import create_post

BASE = {
    "titleTr": "Başlık",
    "titleEn": "Title",
    "contentTr": "<p>tr</p>",
    "contentEn": "<p>en</p>",
    "status": "draft",
}


# --- Auth koruması ---
def test_create_requires_auth(client):
    assert client.post("/api/admin/posts", json=BASE).status_code == 401


def test_admin_list_requires_auth(client):
    assert client.get("/api/admin/posts").status_code == 401


# --- Oluşturma ---
def test_create_published_sets_published_at(client, auth_headers):
    res = create_post(client, auth_headers, status="published")
    assert res.status_code == 201
    data = res.json()
    assert data["slug"] == "title"
    assert data["status"] == "published"
    assert data["publishedAt"] is not None


def test_create_draft_has_no_published_at(client, auth_headers):
    data = create_post(client, auth_headers, status="draft").json()
    assert data["status"] == "draft"
    assert data["publishedAt"] is None


def test_create_sanitizes_content(client, auth_headers):
    data = create_post(
        client, auth_headers, contentTr="<p>x<script>alert(1)</script></p>"
    ).json()
    assert "<script>" not in data["contentTr"]


def test_create_requires_both_titles(client, auth_headers):
    assert create_post(client, auth_headers, titleEn="").status_code == 400
    assert create_post(client, auth_headers, titleTr="").status_code == 400


def test_slug_is_unique(client, auth_headers):
    a = create_post(client, auth_headers).json()
    b = create_post(client, auth_headers).json()
    assert a["slug"] != b["slug"]


# --- Public sorgular ---
def test_public_list_returns_only_published(client, auth_headers):
    create_post(client, auth_headers, status="draft")
    create_post(client, auth_headers, status="published", titleTr="Yayın", titleEn="Pub")
    res = client.get("/api/posts")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["status"] == "published"


def test_get_published_by_slug(client, auth_headers):
    post = create_post(client, auth_headers, status="published").json()
    assert client.get(f"/api/posts/{post['slug']}").status_code == 200


def test_draft_not_reachable_by_slug(client, auth_headers):
    post = create_post(client, auth_headers, status="draft").json()
    assert client.get(f"/api/posts/{post['slug']}").status_code == 404


# --- Güncelleme / yayın / silme ---
def test_update_changes_fields_and_publishes(client, auth_headers):
    post = create_post(client, auth_headers).json()
    res = client.put(
        f"/api/admin/posts/{post['id']}",
        json={**BASE, "titleTr": "Yeni", "titleEn": "New", "status": "published"},
        headers=auth_headers,
    )
    assert res.status_code == 200
    data = res.json()
    assert data["titleTr"] == "Yeni"
    assert data["status"] == "published"
    assert data["publishedAt"] is not None


def test_toggle_publish_back_and_forth(client, auth_headers):
    post = create_post(client, auth_headers, status="draft").json()
    r1 = client.patch(f"/api/admin/posts/{post['id']}/publish", headers=auth_headers)
    assert r1.json()["status"] == "published"
    r2 = client.patch(f"/api/admin/posts/{post['id']}/publish", headers=auth_headers)
    assert r2.json()["status"] == "draft"


def test_delete_post(client, auth_headers):
    post = create_post(client, auth_headers).json()
    assert (
        client.delete(f"/api/admin/posts/{post['id']}", headers=auth_headers).status_code
        == 204
    )
    assert (
        client.get(f"/api/admin/posts/{post['id']}", headers=auth_headers).status_code
        == 404
    )


# --- Autosave ---
def test_autosave_creates_draft(client, auth_headers):
    res = client.post(
        "/api/admin/posts/autosave",
        json={"titleTr": "Taslak", "contentTr": "<p>x</p>"},
        headers=auth_headers,
    )
    assert res.status_code == 200
    pid = res.json()["id"]
    saved = client.get(f"/api/admin/posts/{pid}", headers=auth_headers).json()
    assert saved["status"] == "draft"


def test_autosave_never_publishes_existing(client, auth_headers):
    published = create_post(client, auth_headers, status="published").json()
    client.post(
        "/api/admin/posts/autosave",
        json={"id": published["id"], "titleTr": "Değişti", "titleEn": "Changed"},
        headers=auth_headers,
    )
    after = client.get(f"/api/admin/posts/{published['id']}", headers=auth_headers).json()
    # Autosave içeriği günceller ama yayın durumunu korur.
    assert after["status"] == "published"
    assert after["titleTr"] == "Değişti"


def test_autosave_updates_same_post(client, auth_headers):
    first = client.post(
        "/api/admin/posts/autosave", json={"titleTr": "A"}, headers=auth_headers
    ).json()
    second = client.post(
        "/api/admin/posts/autosave",
        json={"id": first["id"], "titleTr": "B"},
        headers=auth_headers,
    ).json()
    assert first["id"] == second["id"]
