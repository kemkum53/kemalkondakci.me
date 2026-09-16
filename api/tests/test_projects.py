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


# --- Showcase alanları -----------------------------------------------------

def test_category_defaults_to_other(client, auth_headers):
    assert _create(client, auth_headers).json()["category"] == "other"


def test_unknown_category_falls_back_to_other(client, auth_headers):
    assert _create(client, auth_headers, category="uzay").json()["category"] == "other"


def test_public_list_filters_by_category(client, auth_headers):
    _create(client, auth_headers, status="published", name="Web İşi", category="web")
    _create(client, auth_headers, status="published", name="YZ İşi", category="ai")

    web = client.get("/api/projects", params={"category": "web"}).json()
    assert [p["name"] for p in web] == ["Web İşi"]

    assert client.get("/api/projects", params={"category": "uzay"}).json() == []
    assert len(client.get("/api/projects").json()) == 2


def test_category_counts_only_published(client, auth_headers):
    _create(client, auth_headers, status="published", name="Web 1", category="web")
    _create(client, auth_headers, status="published", name="Web 2", category="web")
    _create(client, auth_headers, status="draft", name="Taslak", category="devops")

    counts = client.get("/api/project-categories").json()
    assert counts["web"] == 2
    assert counts["devops"] == 0
    assert counts["ai"] == 0


def test_gallery_and_results_are_saved(client, auth_headers):
    data = _create(
        client,
        auth_headers,
        clientName="Korede",
        roleTr="Tasarım, geliştirme, sunucu",
        roleEn="Design, development, hosting",
        resultsTr=["Sayfa açılışı 4.1 sn -> 0.9 sn", "  ", "Sipariş sayısı 3 kat"],
        gallery=[
            {"url": "/api/media/a.webp", "captionTr": "Ana sayfa", "captionEn": "Home"},
            {"url": "https://cdn.example.com/b.png"},
        ],
    ).json()

    assert data["clientName"] == "Korede"
    assert data["roleTr"] == "Tasarım, geliştirme, sunucu"
    # Boş satırlar atılır.
    assert data["resultsTr"] == ["Sayfa açılışı 4.1 sn -> 0.9 sn", "Sipariş sayısı 3 kat"]
    assert data["gallery"][0]["captionTr"] == "Ana sayfa"
    assert data["gallery"][1]["url"] == "https://cdn.example.com/b.png"
    assert data["gallery"][1]["captionEn"] == ""


def test_gallery_rejects_relative_url(client, auth_headers):
    res = _create(client, auth_headers, gallery=[{"url": "javascript:alert(1)"}])
    assert res.status_code == 422


def test_gallery_and_results_are_capped(client, auth_headers):
    data = _create(
        client,
        auth_headers,
        gallery=[{"url": f"/api/media/{i}.webp"} for i in range(20)],
        resultsEn=[f"result {i}" for i in range(20)],
    ).json()
    assert len(data["gallery"]) == 12
    assert len(data["resultsEn"]) == 8


# --- Sıralama (sürükle-bırak) ----------------------------------------------

def test_reorder_sets_positions(client, auth_headers):
    a = _create(client, auth_headers, name="A").json()
    b = _create(client, auth_headers, name="B").json()
    c = _create(client, auth_headers, name="C").json()

    res = client.patch(
        "/api/admin/projects/reorder",
        json={"ids": [c["id"], a["id"], b["id"]]},
        headers=auth_headers,
    )
    assert res.status_code == 204

    order = {p["id"]: p["position"] for p in client.get("/api/admin/projects", headers=auth_headers).json()}
    assert order[c["id"]] == 0
    assert order[a["id"]] == 1
    assert order[b["id"]] == 2


def test_reorder_requires_auth(client, auth_headers):
    a = _create(client, auth_headers, name="A").json()
    assert client.patch("/api/admin/projects/reorder", json={"ids": [a["id"]]}).status_code == 401


def test_reorder_ignores_unknown_ids(client, auth_headers):
    a = _create(client, auth_headers, name="A").json()
    res = client.patch(
        "/api/admin/projects/reorder",
        json={"ids": ["yok", a["id"]]},
        headers=auth_headers,
    )
    assert res.status_code == 204
    order = {p["id"]: p["position"] for p in client.get("/api/admin/projects", headers=auth_headers).json()}
    assert order[a["id"]] == 1


def test_published_list_follows_position(client, auth_headers):
    a = _create(client, auth_headers, status="published", name="A").json()
    b = _create(client, auth_headers, status="published", name="B").json()
    client.patch(
        "/api/admin/projects/reorder",
        json={"ids": [b["id"], a["id"]]},
        headers=auth_headers,
    )
    names = [p["name"] for p in client.get("/api/projects").json()]
    assert names == ["B", "A"]
