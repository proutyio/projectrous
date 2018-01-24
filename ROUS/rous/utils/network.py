#!/usr/bin/python
import sys
import signal
import commands
import socket
import re
import logging as log
import rous.utils.utils



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



def discover_nodes():    
    scan_subnet()
    nodes = find_rpi_nodes()
    ip_list = parse_ip_list(nodes)
    return ip_list



# arp request taken from
# https://raspberrypi.stackexchange.com/questions/13936/find-raspberry-pi-address-on-local-network

# regex IP string expression taken from
# https://stackoverflow.com/questions/2890896/extract-ip-address-from-an-html-string-python

# extract IP taken from
# https://unix.stackexchange.com/questions/87468/is-there-an-easy-way-to-programmatically-extract-ip-address
