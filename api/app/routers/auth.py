from fastapi import APIRouter, HTTPException, Request, status

from ..config import settings
from ..ratelimit import LoginRateLimiter
from ..schemas import LoginIn, TokenOut
from ..security import create_access_token, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

# Bellek-içi brute-force koruyucu (tek worker için yeterli).
_limiter = LoginRateLimiter(
    max_attempts=settings.login_max_attempts,
    window_seconds=settings.login_window_seconds,
    block_seconds=settings.login_block_seconds,
)


def _client_ip(request: Request) -> str:
    """Gerçek istemci IP'si. Next.js BFF proxy'si arkasında olduğumuz için önce
    X-Forwarded-For zincirinin ilk halkasına bakarız."""
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@router.post("/login", response_model=TokenOut)
def login(data: LoginIn, request: Request) -> TokenOut:
    key = _client_ip(request)

    retry = _limiter.retry_after(key)
    if retry is not None:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Çok fazla başarısız deneme. {retry} saniye sonra tekrar deneyin.",
            headers={"Retry-After": str(retry)},
        )

    ok = data.username == settings.admin_username and verify_password(
        data.password, settings.admin_password_hash
    )
    if not ok:
        _limiter.record_failure(key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı adı veya şifre hatalı",
        )

    _limiter.record_success(key)
    return TokenOut(access_token=create_access_token(data.username))
