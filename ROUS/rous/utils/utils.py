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



def find_my_ip():
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.connect(("1.1.1.1", 80))
        ip = sock.getsockname()[0]
        sock.close()
        return ip
    except:
        log.error("Failed to find my IP address")



def find_ip_from_string(str):
    try:
        ip = re.findall(r'[0-9]+(?:\.[0-9]+){3}',str)
        return ip
    except:
        log.error("Failed to parse IP from string")



def parse_ip_list(lst):
    ip_list = []
    try:
        for node in lst:
            ip = find_ip_from_string(node[1])
            ip_list.append(ip)
        return ip_list
    except:
        log.error("Failed parsing IP list")



def scan_subnet():
    try:
        log.info("- Scanning subnet range... -")
        commands.getstatusoutput('nmap -sP 192.168.0.1/24')
    except:
        log.error("Failed to scan subnet")



#returns list of nodes
def find_rpi_nodes():
    nodes = []
    try:
        for item in mac_list:
            cmd = 'arp -na | grep -i '+item
            nodes.append(commands.getstatusoutput(cmd))
        return nodes
    except:
        log.error("Failed when trying to find RPi nodes")



# ----------------------------------------!!Probably should do this in a thread
# Starts by using bash nmap cmd to ping subnet
# Next it looks for RPi specific MAC addresses
# Lastly it parses IPs out of string
# Returns list of IPs
def discover_nodes():    
    scan_subnet()
    
    log.info("DiscoverNodes - Finding RPi nodes ...")
    nodes = find_rpi_nodes()

    log.info("DiscoverNodes - Parsing IP addresses")
    ip_list = parse_ip_list(nodes)
    return ip_list






# arp request taken from
# https://raspberrypi.stackexchange.com/questions/13936/find-raspberry-pi-address-on-local-network

# regex IP string expression taken from
# https://stackoverflow.com/questions/2890896/extract-ip-address-from-an-html-string-python

# extract IP taken from
# https://unix.stackexchange.com/questions/87468/is-there-an-easy-way-to-programmatically-extract-ip-address
