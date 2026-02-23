import time
from functools import wraps


class RetryError(Exception):
    pass


def retry(
    retries: int = 3,
    delay: float = 0,
    exceptions: tuple[type[Exception], ...] = (Exception,),
):
    """
    Retry decorator.

    :param retries: Number of retry attempts.
    :param delay: Delay between retries (seconds).
    :param exceptions: Exception types that trigger retry.
    """

    if retries < 0:
        raise ValueError("retries must be >= 0")
    if delay < 0:
        raise ValueError("delay must be >= 0")

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None

            for attempt in range(retries + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    if attempt == retries:
                        break
                    if delay:
                        time.sleep(delay)

            raise RetryError(
                f"Function failed after {retries + 1} attempts"
            ) from last_exception

        return wrapper

    return decorator
