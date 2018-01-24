#!/usr/bin/python
import sys
import signal
import commands
import socket
import re
import logging as log

log_file = "rous.log"
whitelist = "rous/utils/whitelist.txt"
mac_list = ['b8:27:eb','00:0f:60']


def setup_logger():
    log.basicConfig(filename=log_file,
        format='%(asctime)s::%(levelname)s:: %(message)s',
        datefmt='%m/%d/%Y %I:%M:%S %p',
        stream=sys.stdout,
        level=log.INFO)
setup_logger()



def read_from_whitelist():
    try:
        f = open(whitelist, "r")
        lst = [line.split(',') for line in f.readlines()]
        return lst
    except:
        log.error("Failed to read whitelist")



def write_to_whitelist(lst):
    erase_text_file(whitelist)
    try:
        f = open(whitelist, "a")
        if lst[0]:
            for l in lst:
                f.write(l[0])
                f.write("\n")
        f.close()
    except:
        log.error("Failed to write to whitelist")



def erase_text_file(text_file):
    try:
        f = open(text_file, 'r+')
        f.truncate()
    except:
        log.error("Failed to erase text file")



def handle_crtl_z(signal, frame):
    log.info("Crtl Z -- Server shutting down")
    sys.exit(0)


