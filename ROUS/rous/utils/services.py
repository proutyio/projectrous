import os
import sys
import time
# import logging as log
import rous.utils.config as config
import rous.utils.printer as printer
import rous.utils.rpi_control as rpi



#this is confusing looking, but I am just building a string
def all_services():
	jstr = '['
	svc = config.all_services()
	x=1
	for s in svc:
		jstr+='{"service":'+'"'+s+'"},'
		x+=1
	jstr = jstr[:-1]+']'
	return jstr


def run_service(service, sender_address):
	if not config.call_service(service, sender_address):
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


def print_file(sender_address):
	printer.print_file("rous/utils/m.txt")

