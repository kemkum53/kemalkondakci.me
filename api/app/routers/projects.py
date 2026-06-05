from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_admin
from ..models import Project
from ..sanitize import sanitize_html
from ..schemas import ProjectIn, ProjectOut
from ..slug import unique_slug

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
def list_published(db: Session = Depends(get_db)):
    return db.scalars(
        select(Project).where(Project.status == "published").order_by(*_published_order())
    ).all()


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


def _apply(project: Project, data: ProjectIn) -> None:
    project.name = data.name.strip()
    project.short_desc_tr = data.short_desc_tr.strip()
    project.short_desc_en = data.short_desc_en.strip()
    project.content_tr = sanitize_html(data.content_tr)
    project.content_en = sanitize_html(data.content_en)
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
