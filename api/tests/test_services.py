BASE = {
    "category": "web",
    "icon": "🛒",
    "nameTr": "Satış Altyapılı Web Sitesi",
    "nameEn": "E-commerce Website",
    "shortDescTr": "Ürün, sepet ve ödeme akışı olan site.",
    "shortDescEn": "Site with catalog, cart and checkout.",
    "featuresTr": ["Ödeme entegrasyonu", "Yönetim paneli", " "],
    "featuresEn": ["Payment integration", "Admin panel"],
    "deliveryMinDays": 21,
    "deliveryMaxDays": 35,
    "references": [{"label": "korede.com.tr", "url": "https://korede.com.tr"}],
    "tags": ["Next.js", "PostgreSQL"],
    "status": "draft",
}


def _create(client, headers, **over):
    payload = {**BASE, **over}
    return client.post("/api/admin/services", json=payload, headers=headers)


def test_create_requires_auth(client):
    assert client.post("/api/admin/services", json=BASE).status_code == 401


def test_create_published(client, auth_headers):
    res = _create(client, auth_headers, status="published")
    assert res.status_code == 201
    data = res.json()
    assert data["slug"] == "satis-altyapili-web-sitesi"
    assert data["status"] == "published"
    assert data["publishedAt"] is not None
    assert data["deliveryMinDays"] == 21
    assert data["references"] == [
        {"label": "korede.com.tr", "url": "https://korede.com.tr"}
    ]


def test_create_requires_name_tr(client, auth_headers):
    assert _create(client, auth_headers, nameTr="").status_code == 400


def test_blank_features_are_dropped(client, auth_headers):
    data = _create(client, auth_headers).json()
    assert data["featuresTr"] == ["Ödeme entegrasyonu", "Yönetim paneli"]


def test_rejects_inverted_delivery_range(client, auth_headers):
    res = _create(client, auth_headers, deliveryMinDays=40, deliveryMaxDays=10)
    assert res.status_code == 422


def test_unknown_category_falls_back_to_other(client, auth_headers):
    data = _create(client, auth_headers, category="uzay").json()
    assert data["category"] == "other"


def test_public_list_only_published(client, auth_headers):
    _create(client, auth_headers, status="draft")
    _create(client, auth_headers, status="published", nameTr="Kurumsal Site")
    res = client.get("/api/services")
    assert res.status_code == 200
    assert len(res.json()) == 1
    assert res.json()[0]["status"] == "published"


def test_featured_sorts_first(client, auth_headers):
    _create(client, auth_headers, status="published", nameTr="Normal", position=1)
    _create(
        client, auth_headers, status="published", nameTr="Öne Çıkan", featured=True, position=5
    )
    items = client.get("/api/services").json()
    assert items[0]["nameTr"] == "Öne Çıkan"


def test_same_name_gets_unique_slug(client, auth_headers):
    """Aynı adla iki hizmet: ikincisi -2 ekiyle benzersizleşir."""
    first = _create(client, auth_headers).json()
    second = _create(client, auth_headers).json()
    assert first["slug"] != second["slug"]
    assert second["slug"].endswith("-2")


def test_get_published_by_slug(client, auth_headers):
    s = _create(client, auth_headers, status="published").json()
    assert client.get(f"/api/services/{s['slug']}").status_code == 200


def test_draft_not_public_by_slug(client, auth_headers):
    s = _create(client, auth_headers).json()
    assert client.get(f"/api/services/{s['slug']}").status_code == 404


def test_update_service(client, auth_headers):
    s = _create(client, auth_headers).json()
    res = client.put(
        f"/api/admin/services/{s['id']}",
        json={**BASE, "nameTr": "Güncel Ad", "deliveryMinDays": 10},
        headers=auth_headers,
    )
    assert res.status_code == 200
    assert res.json()["nameTr"] == "Güncel Ad"
    assert res.json()["deliveryMinDays"] == 10


def test_toggle_publish(client, auth_headers):
    s = _create(client, auth_headers).json()
    res = client.patch(f"/api/admin/services/{s['id']}/publish", headers=auth_headers)
    assert res.json()["status"] == "published"
    res = client.patch(f"/api/admin/services/{s['id']}/publish", headers=auth_headers)
    assert res.json()["status"] == "draft"


def test_delete_service(client, auth_headers):
    s = _create(client, auth_headers).json()
    assert client.delete(f"/api/admin/services/{s['id']}", headers=auth_headers).status_code == 204
    assert client.get(f"/api/admin/services/{s['id']}", headers=auth_headers).status_code == 404

def test_reference_label_defaults_to_host(client, auth_headers):
    """Etiket boş bırakılırsa alan adı kullanılır, www. atılır."""
    data = _create(
        client, auth_headers, references=[{"url": "https://www.evrenselyapi.com.tr/"}]
    ).json()
    assert data["references"] == [
        {"label": "evrenselyapi.com.tr", "url": "https://www.evrenselyapi.com.tr/"}
    ]


def test_multiple_references_kept_in_order(client, auth_headers):
    data = _create(
        client,
        auth_headers,
        references=[
            {"url": "https://korede.com.tr"},
            {"label": "Evrensel Yapı", "url": "https://evrenselyapi.com.tr"},
        ],
    ).json()
    assert [r["label"] for r in data["references"]] == ["korede.com.tr", "Evrensel Yapı"]


def test_rejects_reference_without_scheme(client, auth_headers):
    res = _create(client, auth_headers, references=[{"url": "korede.com.tr"}])
    assert res.status_code == 422


def test_reference_count_is_capped(client, auth_headers):
    refs = [{"url": f"https://ornek{i}.com"} for i in range(10)]
    data = _create(client, auth_headers, references=refs).json()
    assert len(data["references"]) == 6


def test_no_references_yields_empty_list(client, auth_headers):
    data = _create(client, auth_headers, references=[]).json()
    assert data["references"] == []
