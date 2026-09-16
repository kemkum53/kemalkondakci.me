"""Shared work-area taxonomy.

The same keys drive the services page filter, the project category and the
/showcase/<area> pages, so a case study and its pricing stay in one bucket.
"""

CATEGORIES: tuple[str, ...] = ("web", "ai", "automation", "devops", "other")
DEFAULT_CATEGORY = "other"


def normalize(value: str | None) -> str:
    """Unknown or missing keys fall back to "other" instead of raising."""
    return value if value in CATEGORIES else DEFAULT_CATEGORY
