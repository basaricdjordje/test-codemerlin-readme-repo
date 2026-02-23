import pytest
from retry import retry, RetryError


def test_success_without_retry():
    @retry(retries=3)
    def func():
        return 42

    assert func() == 42


def test_retry_until_success():
    calls = {"count": 0}

    @retry(retries=3)
    def func():
        calls["count"] += 1
        if calls["count"] < 3:
            raise ValueError("fail")
        return "ok"

    assert func() == "ok"
    assert calls["count"] == 3


def test_retry_exhaustion():
    @retry(retries=2)
    def func():
        raise ValueError("always fail")

    with pytest.raises(RetryError):
        func()


def test_retry_specific_exception():
    @retry(retries=2, exceptions=(ValueError,))
    def func():
        raise TypeError("wrong type")

    with pytest.raises(TypeError):
        func()


def test_invalid_config():
    with pytest.raises(ValueError):
        retry(retries=-1)

    with pytest.raises(ValueError):
        retry(delay=-1)
