from fastapi import APIRouter, HTTPException, status

from ..config import settings
from ..schemas import LoginIn, TokenOut
from ..security import create_access_token, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenOut)
def login(data: LoginIn) -> TokenOut:
    ok = data.username == settings.admin_username and verify_password(
        data.password, settings.admin_password_hash
    )
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı adı veya şifre hatalı",
        )
    return TokenOut(access_token=create_access_token(data.username))
