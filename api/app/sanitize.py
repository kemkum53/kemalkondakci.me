import nh3

# Tiptap/TinyMCE çıktısını kaydetmeden önce temizler (XSS koruması).
ALLOWED_TAGS = {
    "p", "br", "strong", "b", "em", "i", "u", "s", "del",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "blockquote", "pre", "code", "hr",
    "a", "img",
    "table", "thead", "tbody", "tr", "th", "td",
    "figure", "figcaption", "span",
}

ALLOWED_ATTRIBUTES = {
    # Not: "rel" eklenmez — nh3 onu link_rel üzerinden kendisi yönetir.
    "a": {"href", "title", "target"},
    "img": {"src", "alt", "title", "width", "height"},
    "code": {"class"},
    "pre": {"class"},
    "span": {"class"},
    "td": {"colspan", "rowspan"},
    "th": {"colspan", "rowspan"},
}


def sanitize_html(dirty: str) -> str:
    return nh3.clean(
        dirty or "",
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        url_schemes={"http", "https", "mailto"},
        link_rel="noopener noreferrer nofollow",
    )
