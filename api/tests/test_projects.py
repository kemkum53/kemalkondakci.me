BASE = {
    "name": "Portföy Sitesi",
    "shortDescTr": "kısa TR",
    "shortDescEn": "short EN",
    "contentTr": "<p>tr</p>",
    "contentEn": "<p>en</p>",
    "techStack": ["Python", "FastAPI", "Next.js"],
    "repoUrl": "https://github.com/x/y",
    "status": "draft",
}


def _create(client, headers, **over):
    payload = {**BASE, **over}
    return client.post("/api/admin/projects", json=payload, headers=headers)


def test_create_requires_auth(client):
    assert client.post("/api/admin/projects", json=BASE).status_code == 401


def test_create_published(client, auth_headers):
    res = _create(client, auth_headers, status="published")
    assert res.status_code == 201
    data = res.json()
    assert data["slug"] == "portfoy-sitesi"
    assert data["status"] == "published"
    assert data["publishedAt"] is not None
    assert data["techStack"] == ["Python", "FastAPI", "Next.js"]
    assert data["repoUrl"] == "https://github.com/x/y"


def test_create_requires_name(client, auth_headers):
    assert _create(client, auth_headers, name="").status_code == 400


def test_create_sanitizes_content(client, auth_headers):
    data = _create(client, auth_headers, contentTr="<p>x<script>bad()</script></p>").json()
    assert "<script>" not in data["contentTr"]


def test_public_list_only_published(client, auth_headers):
    _create(client, auth_headers, status="draft")
    _create(client, auth_headers, status="published", name="Yayında Proje")
    res = client.get("/api/projects")
    assert res.status_code == 200
    assert len(res.json()) == 1
    assert res.json()[0]["status"] == "published"


def test_featured_sorts_first(client, auth_headers):
    _create(client, auth_headers, status="published", name="Normal", position=1)
    _create(client, auth_headers, status="published", name="Öne Çıkan", featured=True, position=5)
    items = client.get("/api/projects").json()
    assert items[0]["name"] == "Öne Çıkan"


def test_get_published_by_slug(client, auth_headers):
    p = _create(client, auth_headers, status="published").json()
    assert client.get(f"/api/projects/{p['slug']}").status_code == 200


def test_draft_not_reachable_by_slug(client, auth_headers):
    p = _create(client, auth_headers, status="draft").json()
    assert client.get(f"/api/projects/{p['slug']}").status_code == 404


def test_update_and_toggle_and_delete(client, auth_headers):
    p = _create(client, auth_headers).json()
    upd = client.put(
        f"/api/admin/projects/{p['id']}",
        json={**BASE, "name": "Yeni Ad", "status": "published"},
        headers=auth_headers,
    )
    assert upd.status_code == 200
    assert upd.json()["name"] == "Yeni Ad"
    assert upd.json()["publishedAt"] is not None

    tog = client.patch(f"/api/admin/projects/{p['id']}/publish", headers=auth_headers)
    assert tog.json()["status"] == "draft"

    assert client.delete(f"/api/admin/projects/{p['id']}", headers=auth_headers).status_code == 204
    assert client.get(f"/api/admin/projects/{p['id']}", headers=auth_headers).status_code == 404
