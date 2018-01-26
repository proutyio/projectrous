import RPi.GPIO as rpi
import time
import threading
import logging as log
import rous.utils.utils as utils

pin_green = 17
pin_yellow = 18
green_threads = []
yellow_threads = []


#rpi.setup(pin_yellow,rpi.OUT)

# pins = {"green" : 18,
# 		"red"	: 17,
# 		"blue"	: 27,
# 		}

# threads = {"green" : [],}

# def thread(color):
# 	try:
# 		threads[color].append("test")
# 		print threads
# 	except:
# 		pass


# def start_thread(color):


# def stop_thread(color):
# def thread_green_on():
# 	#try:
# 	# for t in green_threads:
# 	# 	#print green_threads
# 	t = threading.currentThread()
# 	while getattr(t, "exit", True):
# 		rpi.setmode(rpi.BCM)
# 		rpi.setwarnings(False)
# 		rpi.setup(pin_green,rpi.OUT)
# 		rpi.output(pin_green,rpi.HIGH)
# 		time.sleep(.05)
# 	#except:
# 	#	log.error("Failed to turn green on")


# def green_on():
# 	print "GREEN ON"
# 	t = threading.Thread(target=thread_green_on)
# 	t.start()
# 	print t



# def green_off():
# 	print "GREEN OFF"
# 	t = threading.currentThread()
# 	t.exit = False

# 	rpi.setmode(rpi.BCM)
# 	rpi.setwarnings(False)
# 	rpi.setup(pin_green,rpi.OUT)
# 	rpi.output(pin_green,rpi.LOW)
	# for t in green_threads:
	# 	t.exit = False
	# for t in green_threads:
	# 	t.join()

class MyThread(threading.Thread):
    def __init__(self, *args, **kwargs):
        super(MyThread, self).__init__(*args, **kwargs)
        self._stop = threading.Event()

    def stop(self):
        self._stop.set()

    def stopped(self):
        return self._stop.isSet()

def thread_on():
	for t in green_threads:
		while not t.stopped():
			rpi.setmode(rpi.BCM)
			rpi.setwarnings(False)
			rpi.setup(pin_green,rpi.OUT)
			rpi.output(pin_green,rpi.HIGH)
			time.sleep(.05)

def green_off():
	for t in green_threads:
		t.stop()
		t.join()
	rpi.setmode(rpi.BCM)
	rpi.setwarnings(False)
	rpi.setup(pin_green,rpi.OUT)
	rpi.output(pin_green,rpi.LOW)


def green_on():
    t = MyThread(target=thread_on)
    t.start()
    green_threads.append(t)
   






