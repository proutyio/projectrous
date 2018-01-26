import logging as log
# import rous.utils.rpi_control as rpi

# green_threads = []
# yellow_threads = []

# ###### Service Functions #######
# def led_blink_green():
# 	print "blink green"
# 	return

# def led_solid_green_on():
# 	rpi.green_on()	


# def led_solid_green_off():
# 	rpi.green_off()	


# def led_solid_yellow_on():
# 	rpi.yellow_on()	


# def led_solid_yellow_off():
# 	rpi.yellow_off()


# def led_all_on():
# 	rpi.green_on()
# 	rpi.yellow_on()


# def led_all_off():
# 	rpi.green_off()
# 	rpi.yellow_off()

def test():
	print "test"



################################

def run_service(service, address):
	try:
		services[service]()
		log.info("%s - RUNNING Service: %s",address,service)
	except:
		log.error("%s - FAILED to run service: %s",address,service)


def all_services():
	return services


services = {"test:test:test" : test}
# services = {"led:blink:green" : led_blink_green,
# 			"led:solid:green:on" : led_solid_green_on,
# 			"led:solid:green:off" : led_solid_green_off,
# 			"led:solid:yellow:on" : led_solid_yellow_on,
# 			"led:solid:yellow:off" : led_solid_yellow_off,
# 			"led:all:on" : led_all_on,
# 			"led:all:off" : led_all_off
# 			}
