from app.sanitize import sanitize_html


def test_strips_script_tags():
    out = sanitize_html("<p>merhaba<script>alert(1)</script></p>")
    assert "<script>" not in out
    assert "merhaba" in out


def test_keeps_allowed_tags():
    out = sanitize_html("<h2>Başlık</h2><p><strong>kalın</strong></p><ul><li>x</li></ul>")
    assert "<h2>" in out
    assert "<strong>" in out
    assert "<li>" in out


def test_adds_rel_to_links():
    out = sanitize_html('<a href="https://example.com">link</a>')
    assert 'href="https://example.com"' in out
    assert "nofollow" in out


def test_blocks_javascript_scheme():
    out = sanitize_html('<a href="javascript:alert(1)">x</a>')
    assert "javascript:" not in out


def test_drops_disallowed_tags():
    out = sanitize_html('<iframe src="https://evil.com"></iframe><p>ok</p>')
    assert "<iframe" not in out
    assert "ok" in out


def test_handles_empty():
    assert sanitize_html("") == ""
