#!/usr/bin/python
from os import path
import sys
import signal
import commands
import socket
import re
import logging as log

log_file = "rous.log"
whitelist = "rous/utils/whitelist.txt"


def ukey(): return "rous/utils/keys/ukey.txt"
def akey(): return "rous/utils/keys/akey.txt"

#
def setup_logger():
    log.basicConfig(filename=log_file,
        format='%(asctime)s %(levelname)s\t%(message)s',
        datefmt='%m/%d/%Y %I:%M:%S %p',
        stream=sys.stdout,
        level=log.INFO)
setup_logger()


#
def read_from_whitelist(address):
    try:
        f = open(whitelist, "r")
        lst = [line.split(',') for line in f.readlines()]
        f.close()
        return lst
    except:
        log.error("%s - FAILED to read whitelist",address)


#
def write_to_whitelist(lst, address):
    erase_text_file(whitelist, address)
    try:
        f = open(whitelist, "a")
        if lst:
            for l in lst:
                f.write(l)
                f.write("\n")
        f.close()
    except:
        log.error("%s - FAILED to write to whitelist",address)


#
def write_new_key(file, newkey, address):
        erase_text_file(file, address)
    # try:
        f = open(file, "a")
        f.write(newkey)
        f.close()
    # except:
        # log.error("%s - FAILED to write to new key",address)


#
def erase_text_file(text_file, address):
    try:
        f = open(text_file, 'r+')
        f.truncate()
        f.close()
    except:
        log.error("%s - FAILED to erase text file",address)


#
def root_path():
    current = path.dirname(__file__)
    root = path.abspath(path.join(current,"..",".."))
    return root


#
def file_path(basepath):
    try:
        return path.abspath(path.join(root_path(),basepath))
    except:
        print "file path not found"

