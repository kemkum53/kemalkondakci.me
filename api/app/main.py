from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import auth, contact, posts, projects, uploads

API = settings.api_prefix


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Yükleme dizinini garanti et.
    Path(settings.uploads_dir).mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(
    title="kemalkondakci.me API",
    version="1.0.0",
    lifespan=lifespan,
    # Swagger/OpenAPI /api altında (Traefik /api'yi backend'e yönlendirir).
    docs_url=f"{API}/docs",
    redoc_url=f"{API}/redoc",
    openapi_url=f"{API}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=API)
app.include_router(posts.public_router, prefix=API)
app.include_router(posts.admin_router, prefix=API)
app.include_router(projects.public_router, prefix=API)
app.include_router(projects.admin_router, prefix=API)
app.include_router(uploads.router, prefix=API)
app.include_router(contact.router, prefix=API)


@app.get(f"{API}/health", tags=["health"])
def health():
    return {"status": "ok"}
