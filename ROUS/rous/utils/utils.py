#!/usr/bin/python
import sys
import signal
import commands
import re
import logging as log

log_file = "rous/utils/rous.log"
whitelist = "rous/utils/whitelist.txt"
mac_list = ['b8:27:eb','00:0f:60']


def setup_logger():
    log.basicConfig(filename=log_file,
        format='%(asctime)s::%(levelname)s:: %(message)s',
        datefmt='%m/%d/%Y %I:%M:%S %p',
        stream=sys.stdout,
        level=log.INFO)


def parse_whitelist():
	try:
		file = open(whitelist, "r")
		lst = [line.split(',') for line in file.readlines()]
		return lst
	except:
		log.error("Failed to read whitelist")



def handle_crtl_z(signal, frame):
    log.info("Crtl Z -- Server shutting down")
    sys.exit(0)



# Starts by using bash nmap cmd to ping subnet
# Next it looks for RPi specific MAC addresses
# Lastly it parses IPs out of string
# Returns list of IPs
def discover_nodes():
    commands.getstatusoutput('nmap -sP 192.168.0.1/24')
    nodes = []
    ip_list = []

    for item in mac_list:
        cmd = 'arp -na | grep -i '+item
        nodes.append(commands.getstatusoutput(cmd))

    for node in nodes:
        ip_list = re.findall( r'[0-9]+(?:\.[0-9]+){3}',node[1])
    return ip_list





# arp request taken from
# https://raspberrypi.stackexchange.com/questions/13936/find-raspberry-pi-address-on-local-network

# regex expression taken from
# https://stackoverflow.com/questions/2890896/extract-ip-address-from-an-html-string-python