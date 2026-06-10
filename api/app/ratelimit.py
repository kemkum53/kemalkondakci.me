"""Bağımlılıksız, bellek-içi login brute-force koruması.

Tek uvicorn worker'ı (entrypoint `--workers` vermez) için güvenilirdir; durum
süreç belleğinde tutulur. IP başına başarısız deneme sayılır, eşik aşılınca IP
bir süre kilitlenir. Başarılı giriş sayacı sıfırlar.
"""
import threading
import time


class LoginRateLimiter:
    def __init__(self, max_attempts: int, window_seconds: int, block_seconds: int):
        self.max_attempts = max_attempts
        self.window = window_seconds
        self.block = block_seconds
        self._fails: dict[str, list[float]] = {}
        self._blocked: dict[str, float] = {}
        self._lock = threading.Lock()

    @staticmethod
    def _now() -> float:
        return time.monotonic()

    def retry_after(self, key: str) -> int | None:
        """Kilitliyse kalan saniye, değilse None."""
        now = self._now()
        with self._lock:
            until = self._blocked.get(key)
            if until is None:
                return None
            if now < until:
                return int(until - now) + 1
            # kilit süresi doldu → temizle
            self._blocked.pop(key, None)
            self._fails.pop(key, None)
            return None

    def record_failure(self, key: str) -> None:
        now = self._now()
        with self._lock:
            recent = [t for t in self._fails.get(key, []) if now - t < self.window]
            recent.append(now)
            self._fails[key] = recent
            if len(recent) >= self.max_attempts:
                self._blocked[key] = now + self.block
                self._fails.pop(key, None)

    def record_success(self, key: str) -> None:
        with self._lock:
            self._fails.pop(key, None)
            self._blocked.pop(key, None)
