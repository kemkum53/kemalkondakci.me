import smtplib
import ssl
from email.message import EmailMessage

from fastapi import APIRouter, HTTPException, Request, status

from ..config import settings
from ..ratelimit import LoginRateLimiter
from ..schemas import ContactIn

router = APIRouter(prefix="/contact", tags=["contact"])

# IP başına saatlik gönderim limiti (spam koruması) — login limiter'ı yeniden kullanıyoruz.
_limiter = LoginRateLimiter(
    max_attempts=settings.contact_max_per_hour,
    window_seconds=3600,
    block_seconds=3600,
)


def _client_ip(request: Request) -> str:
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _send_email(data: ContactIn) -> None:
    sender = settings.contact_from or settings.smtp_user
    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = settings.contact_to
    msg["Reply-To"] = data.email
    msg["Subject"] = f"[Site] {data.subject or 'İletişim'} — {data.name}"
    msg.set_content(
        f"Ad: {data.name}\n"
        f"E-posta: {data.email}\n"
        f"Konu: {data.subject or '-'}\n\n"
        f"{data.message}\n"
    )

    ctx = ssl.create_default_context()
    if settings.smtp_port == 465:
        with smtplib.SMTP_SSL(settings.smtp_host, 465, context=ctx, timeout=15) as s:
            s.login(settings.smtp_user, settings.smtp_password)
            s.send_message(msg)
    else:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as s:
            if settings.smtp_starttls:
                s.starttls(context=ctx)
            s.login(settings.smtp_user, settings.smtp_password)
            s.send_message(msg)


@router.post("", status_code=status.HTTP_200_OK)
def send_contact(data: ContactIn, request: Request):
    # Honeypot: gizli alan doluysa bot kabul et, sessizce başarı dön (gönderme yok).
    if data.company:
        return {"ok": True}

    if not (settings.smtp_host and settings.smtp_user and settings.smtp_password):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="İletişim formu şu an yapılandırılmamış.",
        )

    key = _client_ip(request)
    retry = _limiter.retry_after(key)
    if retry is not None:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Çok fazla mesaj gönderdin. {retry // 60 + 1} dakika sonra tekrar dene.",
            headers={"Retry-After": str(retry)},
        )

    try:
        _send_email(data)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="E-posta gönderilemedi. Lütfen daha sonra tekrar dene.",
        )

    # Başarılı gönderimi saatlik limit için say.
    _limiter.record_failure(key)
    return {"ok": True}
