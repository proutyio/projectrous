import os
import sys
import time
import threading
# import logging as log
import rous.utils.config as config
import rous.utils.printer as printer
import rous.utils.rpi_control as rpi
import rous.utils.network as network



#this is confusing looking, but I am just building a string
def all_services():
	jstr = '['
	svc = config.all_services()
	for s in svc:
		jstr+='{"service":'+'"'+s+'"},'
	jstr = jstr[:-1]+']'
	return jstr


def run_service(msg, ukey, sender_address):
	if msg['service'] == "complex":
		complex(msg, ukey, sender_address)
	elif not config.call_service(msg['service'], sender_address):
		print "run service failed"
		# log.info("%s Error - Failed to call serivce", sender_address)


# this code looks like it should be refactored but it works like this for
#	a reason... to allow the config to specifically specify what services 
#	are offered and thus there must be the same named function here
def green_on(sender_address):
	rpi.on("green")

def green_off(sender_address):
	rpi.off("green")

def red_on(sender_address):
	rpi.on("red")

def red_off(sender_address):
	rpi.off("red")

def blue_on(sender_address):
	rpi.on("blue")

def blue_off(sender_address):
	rpi.off("blue")

def red_blue_green_on(sender_address):
	rpi.on("red")
	rpi.on("blue")
	rpi.on("green")

def red_blue_on(sender_address):
	rpi.on("red")
	rpi.on("blue")

def red_green_on(sender_address):
	rpi.on("red")
	rpi.on("green")

def blue_green_on(sender_address):
	rpi.on("blue")
	rpi.on("green")


def print_file(sender_address):
	printer.print_file("rous/utils/m.txt")


def thread_complex(services,ukey,sender_address):
	for s in services:
		s+="}"
		if s[0] == ",":
			s = s[1:]
		network.send_multicast_message(s,ukey,sender_address)
		time.sleep(3);


def complex(msg, ukey, sender_address):
	services = msg['services'][1:-1].split("}")
	t = threading.Thread(target=thread_complex,args=[services,ukey,sender_address])
	t.start()