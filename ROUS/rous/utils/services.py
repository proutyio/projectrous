import logging as log
import rous.utils.rpi_control as rpi

green_threads = []
yellow_threads = []

###### Service Functions #######

def led_solid_green_on(address):
	rpi.green_on()
	log.info("%s - LED: green on", address)


def led_solid_green_off(address):
	rpi.green_off()
	log.info("%s - LED: green off", address)	


def test():
	print "test"



################################

def run_service(service, address):

	if(service == "led:solid:green:on"):
		led_solid_green_on(address)
	if(service == "led:solid:green:off"):
		led_solid_green_off(address)
	#try:
		# log.info("%s - RUNNING Service: %s",address,service)
		

		
		# services[service]
	#except:
	#	log.error("%s - FAILED to run service: %s",address,service)
services = {"led:solid:green:on" : "",
			"led:solid:green:off" : "",
 			}

def all_services():
	return services



