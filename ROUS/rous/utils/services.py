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
		print "failed"
		# log.info("%s Error - Failed to call serivce", sender_address)


def green_on(sender_address):
	rpi.green_on()
	print "green_on ------"

def green_off(sender_address):
	rpi.green_off()


def red_on(sender_address):
	rpi.red_on()
	print "red_on ------"


def red_off(sender_address):
	rpi.red_off()


def blue_on(sender_address):
	rpi.blue_on()
	print "blue_on ------"


def blue_off(sender_address):
	rpi.blue_off()


def print_file(sender_address):
	printer.print_file("rous/utils/m.txt")

