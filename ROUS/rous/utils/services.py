import logging as log
# import rous.utils.rpi_control as rpi
import config


def all_services():
	return config.all_services()


def call_service(service, sender_address):
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

