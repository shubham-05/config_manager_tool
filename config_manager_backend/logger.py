import logging
import sys


def get_logger(
    logger_name,
    log_level=logging.INFO,
    log_format="%(asctime)s [%(module)s.%(funcName)s.%(lineno)d] - %(levelname)s - %(message)s",
):
    _logger = logging.getLogger(logger_name)
    _logger.setLevel(log_level)
    root_logger = logging.getLogger()
    if not _logger.handlers and not root_logger.handlers:
        ch = logging.StreamHandler(sys.stderr)
        formatter = logging.Formatter(log_format, "%Y-%m-%d %H:%M:%S")
        ch.setFormatter(formatter)
        _logger.addHandler(ch)
    return _logger


def main(logger_name):
    logger = get_logger(logger_name, log_level=logging.INFO)
    return logger
