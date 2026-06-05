from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_admin
from ..models import Post
from ..sanitize import sanitize_html
from ..schemas import AutosaveIn, AutosaveOut, PostIn, PostOut
from ..slug import unique_slug

# --- Public ---
public_router = APIRouter(tags=["posts"])


@public_router.get("/posts", response_model=list[PostOut])
def list_published(db: Session = Depends(get_db)):
    return db.scalars(
        select(Post)
        .where(Post.status == "published")
        .order_by(Post.published_at.desc().nullslast(), Post.created_at.desc())
    ).all()


@public_router.get("/posts/{slug}", response_model=PostOut)
def get_published(slug: str, db: Session = Depends(get_db)):
    post = db.scalar(select(Post).where(Post.slug == slug))
    if post is None or post.status != "published":
        raise HTTPException(status_code=404, detail="Yazı bulunamadı")
    return post


# --- Admin (JWT gerekli) ---
admin_router = APIRouter(
    prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)]
)


@admin_router.get("/posts", response_model=list[PostOut])
def list_all(db: Session = Depends(get_db)):
    return db.scalars(select(Post).order_by(Post.updated_at.desc())).all()


@admin_router.get("/posts/{post_id}", response_model=PostOut)
def get_one(post_id: str, db: Session = Depends(get_db)):
    post = db.get(Post, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Yazı bulunamadı")
    return post


@admin_router.post("/posts", response_model=PostOut, status_code=201)
def create_post(data: PostIn, db: Session = Depends(get_db)):
    if not data.title_tr.strip() or not data.title_en.strip():
        raise HTTPException(status_code=400, detail="Her iki dil için de başlık gerekli (TR ve EN).")

    new_status = "published" if data.status == "published" else "draft"
    slug = unique_slug(db, data.slug or data.title_en or data.title_tr)

    post = Post(
        slug=slug,
        status=new_status,
        title_tr=data.title_tr.strip(),
        title_en=data.title_en.strip(),
        excerpt_tr=data.excerpt_tr.strip(),
        excerpt_en=data.excerpt_en.strip(),
        content_tr=sanitize_html(data.content_tr),
        content_en=sanitize_html(data.content_en),
        cover_image=(data.cover_image or None),
        published_at=datetime.now(timezone.utc) if new_status == "published" else None,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@admin_router.put("/posts/{post_id}", response_model=PostOut)
def update_post(post_id: str, data: PostIn, db: Session = Depends(get_db)):
    post = db.get(Post, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Yazı bulunamadı")
    if not data.title_tr.strip() or not data.title_en.strip():
        raise HTTPException(status_code=400, detail="Her iki dil için de başlık gerekli (TR ve EN).")

    new_status = "published" if data.status == "published" else "draft"
    post.slug = unique_slug(db, data.slug or data.title_en or data.title_tr, ignore_id=post.id)
    post.status = new_status
    post.title_tr = data.title_tr.strip()
    post.title_en = data.title_en.strip()
    post.excerpt_tr = data.excerpt_tr.strip()
    post.excerpt_en = data.excerpt_en.strip()
    post.content_tr = sanitize_html(data.content_tr)
    post.content_en = sanitize_html(data.content_en)
    post.cover_image = data.cover_image or None
    # Taslaktan yayına ilk geçişte publishedAt ayarla.
    if new_status == "published" and post.published_at is None:
        post.published_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(post)
    return post


@admin_router.post("/posts/autosave", response_model=AutosaveOut)
def autosave(data: AutosaveIn, db: Session = Depends(get_db)):
    """Taslağı otomatik kaydeder. Yayın durumunu ASLA değiştirmez."""
    fields = dict(
        title_tr=data.title_tr.strip() or "Adsız taslak",
        title_en=data.title_en.strip() or "Untitled draft",
        excerpt_tr=data.excerpt_tr.strip(),
        excerpt_en=data.excerpt_en.strip(),
        content_tr=sanitize_html(data.content_tr),
        content_en=sanitize_html(data.content_en),
        cover_image=(data.cover_image or None),
    )

    if data.id:
        post = db.get(Post, data.id)
        if post is None:
            raise HTTPException(status_code=404, detail="Yazı bulunamadı")
        for key, value in fields.items():
            setattr(post, key, value)
    else:
        slug = unique_slug(db, data.slug or data.title_en or data.title_tr or "taslak")
        post = Post(slug=slug, status="draft", published_at=None, **fields)
        db.add(post)

    db.commit()
    db.refresh(post)
    return AutosaveOut(id=post.id, saved_at=post.updated_at)


@admin_router.patch("/posts/{post_id}/publish", response_model=PostOut)
def toggle_publish(post_id: str, db: Session = Depends(get_db)):
    post = db.get(Post, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Yazı bulunamadı")

    post.status = "draft" if post.status == "published" else "published"
    if post.status == "published" and post.published_at is None:
        post.published_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(post)
    return post


@admin_router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: str, db: Session = Depends(get_db)):
    post = db.get(Post, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Yazı bulunamadı")
    db.delete(post)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
