"""Admin şifresinin bcrypt hash'ini üretir.

Kullanım: python -m app.set_admin <şifre>
Çıktıyı api/.env içindeki ADMIN_PASSWORD_HASH değerine yapıştır.
"""

import sys

from .security import hash_password


def main() -> None:
    if len(sys.argv) != 2:
        print("Kullanım: python -m app.set_admin <şifre>")
        raise SystemExit(1)

    password = sys.argv[1]
    if len(password) < 8:
        print("Şifre en az 8 karakter olmalı.")
        raise SystemExit(1)

    print("\nAşağıdaki satırı api/.env içindeki ADMIN_PASSWORD_HASH değeri olarak yapıştır:\n")
    print(f"ADMIN_PASSWORD_HASH={hash_password(password)}\n")


if __name__ == "__main__":
    main()
