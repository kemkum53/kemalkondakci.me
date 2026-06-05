def create_post(client, headers, **overrides):
    """Test yardımcı: post oluşturur, Response döner."""
    payload = {
        "titleTr": "Başlık",
        "titleEn": "Title",
        "contentTr": "<p>tr içerik</p>",
        "contentEn": "<p>en content</p>",
        "status": "draft",
    }
    payload.update(overrides)
    return client.post("/api/admin/posts", json=payload, headers=headers)
