import logging as log


###### Service Functions #######
def led_blink_green():
	print "blink green"
	return



################################

def run_service(service):
	try:
		services[service[0]]()
		log.info("Running Service: %s",service[0])
	except:
		log.error("Failed to run service: %s",service[0])


def all_services():
	return services


services = {"led:blink:green" : led_blink_green}
