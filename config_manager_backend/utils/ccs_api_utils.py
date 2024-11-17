import asyncio
import logger
import aiohttp

logger = logger.main("ccs_api_utils")

MAX_RETRY_SECONDS = 160  # 2min so that we can catch 500 error at earliest


# This function meant to make the API calls and handle the status properly.
# return the 2xx response or raise Exceptions for all non-2xx status.
# If 2xx, 3xx and 4xx response get, do not retry but
# If 5xx response got, exponential retry on server side error for 5 times [5s -> 80s]
async def retriable_api_call(func, url, **kwargs):
    need_retry = True
    retry_delay = 5
    # stop if no retry needed or retry delay exceed 80s (after 5 exponential retries)
    while need_retry and retry_delay < MAX_RETRY_SECONDS:
        async with aiohttp.ClientSession() as session:
            async with session.request(func, url, **kwargs, ssl=False) as response:
                if 500 <= response.status <= 599:
                    retry_msg = f"Retrying in {retry_delay}s." + (
                        " Reaching retry limit. Will not retry if failed again!"
                        if retry_delay == 80
                        else ""
                    )
                    logger.error(
                        f"Got {response.status} when calling {func} with url: {url} and kwargs: {kwargs}! {retry_msg}"
                    )
                    await asyncio.sleep(retry_delay)
                    retry_delay *= 2
                else:
                    need_retry = False  # no need to retry for all non-5xx status
                    if 200 <= response.status <= 299:
                        return await response.json()
                    elif 400 <= response.status <= 499:
                        # change log
                        logger.error(
                            f"Got {response.status} when calling {func} with url: {url} and args: {kwargs}!"
                        )
                        raise Exception(
                            f"Unable to get valid response with making {func} request with url: {url} and args: {kwargs}!"
                        )
                    else:
                        # change log
                        logger.warning(
                            f"Got {response.status} when calling {func} with url: {url} and args: {kwargs}!"
                        )
                        raise Exception(
                            f"Unable to get valid response with making {func} request with url: {url} and args: {kwargs}!"
                        )
    # Handle continuous retries with server side error
    if need_retry:
        # raise Exception to parent caller api
        raise Exception(
            f"Failed to get valid response due to 5** server error with making {func} request with url: {url} and args: {kwargs}!"
        )
