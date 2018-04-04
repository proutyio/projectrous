import RPi.GPIO as rpi
import time
import threading
# import logging as log
import rous.utils.utils as utils


green_threads = []
red_threads = []
blue_threads = []
pins = [("green",18,green_threads),("red",23,red_threads),("blue",24,blue_threads)]

def setup():
	rpi.setmode(rpi.BCM)
	rpi.setwarnings(False)
	for p in pins:
		rpi.setup(p[1],rpi.OUT)
setup()


def thread_on(str_pin):
	(pin, threads) = find_pin(str_pin)
	while getattr(threads, "exit", True):
		rpi.output(pin,rpi.HIGH)
		time.sleep(.1)


def off(str_pin):
	(pin, threads) = find_pin(str_pin)
	if threads:
		threads[0].exit = False
		threads[0].join()
		rpi.output(pin,rpi.LOW)
		del threads[:]


def on(str_pin):
	(pin, threads) = find_pin(str_pin)
	if not threads:
		t = threading.Thread(target=thread_on)
		threads.append(t)
		t.start()


def find_pin(pin):
	for p in pins:
		if p[0] == pin:
			return (p[1],p[2])



# def led_solid_green_on():
# 	while getattr(threads[0], "exit", True):
# 		rpi.output(p1,rpi.HIGH)
# 		time.sleep(.1)


# def green_off():
# 	if threads:
# 		threads[0].exit = False
# 		threads[0].join()
# 		rpi.output(p1,rpi.LOW)
# 		del threads[:]
		
		
# def green_on():
# 	if not threads:
# 		t = threading.Thread(target=led_solid_green_on)
# 		threads.append(t)
# 		t.start()