import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from ..config import settings
from ..deps import get_current_admin
from ..schemas import UploadOut

# İzin verilen görsel türleri → uzantı. SVG bilerek hariç (XSS riski).
ALLOWED_TYPES = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
}
CONTENT_TYPES = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
}

router = APIRouter(tags=["media"])


@router.post(
    "/admin/uploads",
    response_model=UploadOut,
    dependencies=[Depends(get_current_admin)],
)
async def upload_image(file: UploadFile = File(...)) -> UploadOut:
    ext = ALLOWED_TYPES.get(file.content_type or "")
    if ext is None:
        raise HTTPException(status_code=415, detail="Geçersiz görsel türü (png, jpg, webp, gif)")

    data = await file.read()
    if len(data) > settings.max_upload_bytes:
        raise HTTPException(status_code=413, detail="Dosya çok büyük (en fazla 5 MB)")

    uploads = Path(settings.uploads_dir)
    uploads.mkdir(parents=True, exist_ok=True)
    name = f"{uuid.uuid4().hex}.{ext}"
    (uploads / name).write_bytes(data)

    return UploadOut(location=f"{settings.api_prefix}/media/{name}")


@router.get("/media/{filename}")
def serve_media(filename: str):
    # Path traversal koruması: yalnızca dosya adını kullan.
    safe_name = Path(filename).name
    path = Path(settings.uploads_dir) / safe_name

    content_type = CONTENT_TYPES.get(path.suffix.lower())
    if content_type is None or not path.is_file():
        raise HTTPException(status_code=404, detail="Bulunamadı")

    return FileResponse(
        path,
        media_type=content_type,
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )
