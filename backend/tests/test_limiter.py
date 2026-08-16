"""Unit tests for the rate-limit key function."""

import pytest

from app.core.limiter import get_client_ip


class _Headers:
    def __init__(self, mapping):
        self._mapping = {k.lower(): v for k, v in (mapping or {}).items()}

    def get(self, key, default=None):
        return self._mapping.get(key.lower(), default)


class _Request:
    def __init__(self, headers=None, host="proxy.internal"):
        self.headers = _Headers(headers)
        self.client = type("Client", (), {"host": host})() if host is not None else None


@pytest.mark.unit
def test_get_client_ip_prefers_x_forwarded_for():
    req = _Request(headers={"X-Forwarded-For": "203.0.113.5, 10.0.0.1"}, host="proxy.internal")
    assert get_client_ip(req) == "203.0.113.5"


@pytest.mark.unit
def test_get_client_ip_falls_back_to_socket_peer():
    req = _Request(headers={}, host="127.0.0.1")
    assert get_client_ip(req) == "127.0.0.1"


@pytest.mark.unit
def test_get_client_ip_defaults_when_no_client():
    req = _Request(headers={}, host=None)
    assert get_client_ip(req) == "127.0.0.1"
