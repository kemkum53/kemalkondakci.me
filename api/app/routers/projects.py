from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..categories import CATEGORIES
from ..database import get_db
from ..deps import get_current_admin
from ..models import Project
from ..sanitize import sanitize_html
from ..schemas import GalleryImage, ProjectIn, ProjectOut
from ..slug import unique_slug

# A case study reads as a story, not a contact sheet; cap the gallery.
MAX_GALLERY_IMAGES = 12
MAX_RESULTS = 8

# --- Public ---
public_router = APIRouter(tags=["projects"])


def _published_order():
    return (
        Project.featured.desc(),
        Project.position.asc(),
        Project.published_at.desc().nullslast(),
        Project.created_at.desc(),
    )


@public_router.get("/projects", response_model=list[ProjectOut])
def list_published(
    db: Session = Depends(get_db),
    category: str | None = Query(default=None),
):
    stmt = select(Project).where(Project.status == "published")
    if category:
        # An unknown key returns nothing rather than the whole list.
        stmt = stmt.where(Project.category == category)
    return db.scalars(stmt.order_by(*_published_order())).all()


@public_router.get("/project-categories", response_model=dict[str, int])
def category_counts(db: Session = Depends(get_db)):
    """Published case count per work area. Drives the /showcase index."""
    rows = db.execute(
        select(Project.category, func.count())
        .where(Project.status == "published")
        .group_by(Project.category)
    ).all()
    counts = {c: 0 for c in CATEGORIES}
    for category, total in rows:
        if category in counts:
            counts[category] = total
    return counts


@public_router.get("/projects/{slug}", response_model=ProjectOut)
def get_published(slug: str, db: Session = Depends(get_db)):
    project = db.scalar(select(Project).where(Project.slug == slug))
    if project is None or project.status != "published":
        raise HTTPException(status_code=404, detail="Proje bulunamadı")
    return project


# --- Admin (JWT gerekli) ---
admin_router = APIRouter(
    prefix="/admin", tags=["admin-projects"], dependencies=[Depends(get_current_admin)]
)


def _clean_list(values: list[str], limit: int) -> list[str]:
    return [v.strip() for v in values if v.strip()][:limit]


def _clean_gallery(images: list[GalleryImage]) -> list[dict]:
    return [
        {"url": img.url, "caption_tr": img.caption_tr, "caption_en": img.caption_en}
        for img in images[:MAX_GALLERY_IMAGES]
    ]


def _apply(project: Project, data: ProjectIn) -> None:
    project.name = data.name.strip()
    project.category = data.category
    project.short_desc_tr = data.short_desc_tr.strip()
    project.short_desc_en = data.short_desc_en.strip()
    project.content_tr = sanitize_html(data.content_tr)
    project.content_en = sanitize_html(data.content_en)
    project.client_name = data.client_name.strip()[:255]
    project.role_tr = data.role_tr.strip()[:255]
    project.role_en = data.role_en.strip()[:255]
    project.results_tr = _clean_list(data.results_tr, MAX_RESULTS)
    project.results_en = _clean_list(data.results_en, MAX_RESULTS)
    project.gallery = _clean_gallery(data.gallery)
    project.tech_stack = [t.strip() for t in data.tech_stack if t.strip()]
    project.repo_url = data.repo_url or None
    project.live_url = data.live_url or None
    project.cover_image = data.cover_image or None
    project.featured = bool(data.featured)
    project.position = data.position


@admin_router.get("/projects", response_model=list[ProjectOut])
def list_all(db: Session = Depends(get_db)):
    return db.scalars(
        select(Project).order_by(Project.position.asc(), Project.updated_at.desc())
    ).all()


@admin_router.get("/projects/{project_id}", response_model=ProjectOut)
def get_one(project_id: str, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")
    return project


@admin_router.post("/projects", response_model=ProjectOut, status_code=201)
def create_project(data: ProjectIn, db: Session = Depends(get_db)):
    if not data.name.strip():
        raise HTTPException(status_code=400, detail="Proje adı gerekli.")

    new_status = "published" if data.status == "published" else "draft"
    project = Project(
        slug=unique_slug(db, data.slug or data.name),
        status=new_status,
        published_at=datetime.now(timezone.utc) if new_status == "published" else None,
    )
    _apply(project, data)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@admin_router.put("/projects/{project_id}", response_model=ProjectOut)
def update_project(project_id: str, data: ProjectIn, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")
    if not data.name.strip():
        raise HTTPException(status_code=400, detail="Proje adı gerekli.")

    new_status = "published" if data.status == "published" else "draft"
    project.slug = unique_slug(db, data.slug or data.name, ignore_id=project.id)
    project.status = new_status
    if new_status == "published" and project.published_at is None:
        project.published_at = datetime.now(timezone.utc)
    _apply(project, data)

    db.commit()
    db.refresh(project)
    return project


@admin_router.patch("/projects/{project_id}/publish", response_model=ProjectOut)
def toggle_publish(project_id: str, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")

    project.status = "draft" if project.status == "published" else "published"
    if project.status == "published" and project.published_at is None:
        project.published_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(project)
    return project


@admin_router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: str, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")
    db.delete(project)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
