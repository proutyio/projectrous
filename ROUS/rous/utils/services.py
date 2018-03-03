import os
import sys
import time
import logging as log
import rous.utils.config as config
import rous.utils.printer as printer
# import rous.utils.rpi_control as rpi



def all_services():
	return config.all_services()


def run_service(service, params, sender_address):
	if not config.call_service(service, sender_address):
		print "failed"
		log.info("%s Error - Failed to call serivce", sender_address)


def green_on(sender_address):
	# rpi.green_on()
	print "green_on ------"
	log.info("%s - LED: green on", sender_address)


# def green_off(sender_address):
# 	rpi.green_off()
# 	log.info("%s - LED: green off", sender_address)	



def print_file(sender_address):
	printer.print_file("rous/utils/m.txt")

