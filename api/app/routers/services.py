from datetime import datetime, timezone
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_admin
from ..models import Service
from ..schemas import ServiceIn, ServiceOut, ServiceReference
from ..slug import unique_slug

# --- Public ---
public_router = APIRouter(tags=["services"])


def _published_order():
    return (
        Service.featured.desc(),
        Service.position.asc(),
        Service.published_at.desc().nullslast(),
        Service.created_at.desc(),
    )


@public_router.get("/services", response_model=list[ServiceOut])
def list_published(db: Session = Depends(get_db)):
    return db.scalars(
        select(Service).where(Service.status == "published").order_by(*_published_order())
    ).all()


@public_router.get("/services/{slug}", response_model=ServiceOut)
def get_published(slug: str, db: Session = Depends(get_db)):
    service = db.scalar(select(Service).where(Service.slug == slug))
    if service is None or service.status != "published":
        raise HTTPException(status_code=404, detail="Hizmet bulunamadı")
    return service


# --- Admin (JWT gerekli) ---
admin_router = APIRouter(
    prefix="/admin", tags=["admin-services"], dependencies=[Depends(get_current_admin)]
)


def _clean_list(values: list[str]) -> list[str]:
    return [v.strip() for v in values if v.strip()]


MAX_REFERENCES = 6


def _reference_label(ref: ServiceReference) -> str:
    """Etiket boşsa linkin alan adını kullan (www. atılır)."""
    if ref.label:
        return ref.label
    host = urlparse(ref.url).netloc
    return host[4:] if host.startswith("www.") else host


def _clean_references(refs: list[ServiceReference]) -> list[dict]:
    return [
        {"label": _reference_label(r), "url": r.url}
        for r in refs[:MAX_REFERENCES]
        if r.url.strip()
    ]


def _apply(service: Service, data: ServiceIn) -> None:
    service.category = data.category
    service.icon = data.icon.strip()[:16]
    service.name_tr = data.name_tr.strip()
    service.name_en = data.name_en.strip()
    service.short_desc_tr = data.short_desc_tr.strip()
    service.short_desc_en = data.short_desc_en.strip()
    service.features_tr = _clean_list(data.features_tr)
    service.features_en = _clean_list(data.features_en)

    service.delivery_min_days = data.delivery_min_days
    service.delivery_max_days = data.delivery_max_days
    service.delivery_note_tr = data.delivery_note_tr.strip()
    service.delivery_note_en = data.delivery_note_en.strip()

    service.references = _clean_references(data.references)

    service.tags = _clean_list(data.tags)
    service.featured = bool(data.featured)
    service.position = data.position


@admin_router.get("/services", response_model=list[ServiceOut])
def list_all(db: Session = Depends(get_db)):
    return db.scalars(
        select(Service).order_by(Service.position.asc(), Service.updated_at.desc())
    ).all()


@admin_router.get("/services/{service_id}", response_model=ServiceOut)
def get_one(service_id: str, db: Session = Depends(get_db)):
    service = db.get(Service, service_id)
    if service is None:
        raise HTTPException(status_code=404, detail="Hizmet bulunamadı")
    return service


@admin_router.post("/services", response_model=ServiceOut, status_code=201)
def create_service(data: ServiceIn, db: Session = Depends(get_db)):
    if not data.name_tr.strip():
        raise HTTPException(status_code=400, detail="Hizmet adı (TR) gerekli.")

    new_status = "published" if data.status == "published" else "draft"
    service = Service(
        slug=unique_slug(db, data.slug or data.name_tr, model=Service),
        status=new_status,
        published_at=datetime.now(timezone.utc) if new_status == "published" else None,
    )
    _apply(service, data)
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@admin_router.put("/services/{service_id}", response_model=ServiceOut)
def update_service(service_id: str, data: ServiceIn, db: Session = Depends(get_db)):
    service = db.get(Service, service_id)
    if service is None:
        raise HTTPException(status_code=404, detail="Hizmet bulunamadı")
    if not data.name_tr.strip():
        raise HTTPException(status_code=400, detail="Hizmet adı (TR) gerekli.")

    new_status = "published" if data.status == "published" else "draft"
    service.slug = unique_slug(
        db, data.slug or data.name_tr, ignore_id=service.id, model=Service
    )
    service.status = new_status
    if new_status == "published" and service.published_at is None:
        service.published_at = datetime.now(timezone.utc)
    _apply(service, data)

    db.commit()
    db.refresh(service)
    return service


@admin_router.patch("/services/{service_id}/publish", response_model=ServiceOut)
def toggle_publish(service_id: str, db: Session = Depends(get_db)):
    service = db.get(Service, service_id)
    if service is None:
        raise HTTPException(status_code=404, detail="Hizmet bulunamadı")

    service.status = "draft" if service.status == "published" else "published"
    if service.status == "published" and service.published_at is None:
        service.published_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(service)
    return service


@admin_router.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(service_id: str, db: Session = Depends(get_db)):
    service = db.get(Service, service_id)
    if service is None:
        raise HTTPException(status_code=404, detail="Hizmet bulunamadı")
    db.delete(service)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
