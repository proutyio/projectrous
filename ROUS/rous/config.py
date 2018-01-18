import logging as log
import sys


log_file = "rous/rous.log"


def setup_logger():
    log.basicConfig(filename=log_file,
        format='%(asctime)s::%(levelname)s:: %(message)s',
        datefmt='%m/%d/%Y %I:%M:%S %p',
        stream=sys.stdout,
        level=log.INFO)


