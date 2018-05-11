import os
import sys
import time
import threading
# import logging as log
import config
import printer
import rpi_control as rpi
import network

g_on = '{"tag":"service","service":"green_on"}'
r_on = '{"tag":"service","service":"red_on"}'
b_on = '{"tag":"service","service":"blue_on"}'
p_on = '{"tag":"service","service":"pink_on"}'
y_on = '{"tag":"service","service":"yellow_on"}'
w_on = '{"tag":"service","service":"white_on"}'
complex_timeout = 2

#this is confusing looking, but I am just building a string
def all_services():
	jstr = '['
	svc = config.all_services()
	for s in svc:
		jstr+='{"service":'+'"'+s+'"},'
	jstr = jstr[:-1]+']'
	return jstr


def run_service(msg, ukey, sender_address):
		# print "out"
	# rpi.on("green")
	#try:
		if not msg['service'] == "complex":
			# print msg['service']
			# print config.call_service(msg['service'], sender_address)
			
			## !! temp bug fix, hardcoded for now
			srv = msg['service']
			if srv == "green_on":
				green_on(sender_address)
			if srv == "red_on":
				red_on(sender_address)
			if srv == "blue_on":
				blue_on(sender_address)
			if srv == "pink_on":
				pink_on(sender_address)
			if srv == "yellow_on":
				yellow_on(sender_address)
			if srv == "white_on":
				white_on(sender_address)
			if srv == "red_blue_green":
				red_blue_green(ukey,sender_address)
			if srv == "white_pink_yellow":
				white_pink_yellow(ukey,sender_address)
		else:
			# print "in"
			complex(msg, ukey, sender_address)
			# print "call service "+msg['service']
			# log.info("%s Error - Failed to call serivce", sender_address)
	#finally:
	#	pass


# this code looks like it should be refactored but it works like this for
#	a reason... to allow the config to specifically specify what services 
#	are offered and thus there must be the same named function here
def green_on(sender_address):
	rpi.on("green")

def red_on(sender_address):
	rpi.on("red")

def blue_on(sender_address):
	rpi.on("blue")

def yellow_on(sender_address):
	rpi.on("yellow")

def white_on(sender_address):
	rpi.on("white")

def pink_on(sender_address):
	rpi.on("pink")

def print_bw(sender_address):
	printer.print_file("rous/utils/m.txt")

def print_color(sender_address):
	printer.print_file("rous/utils/m.txt")

def red_blue_green(ukey, sender_address):
	lst = [r_on,b_on,g_on]
	# msg = build_complex_service(lst)
	# network.send_multicast_message(msg,ukey,sender_address)
	for l in lst:
		network.send_multicast_message(l,ukey,sender_address)
		time.sleep(3)

def white_pink_yellow(ukey, sender_address):
	lst = [w_on,p_on,y_on]
	# msg = build_complex_service(lst)
	# network.send_multicast_message(msg,ukey,sender_address)
	for l in lst:
		network.send_multicast_message(l,ukey,sender_address)
		time.sleep(3)


def build_complex_service(msg_lst):
	msg = '['
	for m in msg_lst:
		msg+=''+m+','
	msg = msg[:-1]+']'
	msg = '{"tag":"service","service":"complex","services":'+msg+'}'
	return msg 

def thread_complex(services,ukey,sender_address):
	for s in services:
		s+="}"
		if s[0] == ",":
			s = s[1:]
		network.send_multicast_message(s,ukey,sender_address)
		time.sleep(complex_timeout)
		network.send_multicast_message('{"tag":"timevalue"}',ukey,sender_address)
		time.sleep(complex_timeout)


def complex(msg, ukey, sender_address):
	try:
		if type(msg['services']) == type([]):
			services = []
			for m in msg['services']:
				services.append('{"tag":"'+m['tag']+'","service":"'+m['service']+'"' )
		else:
			services = msg['services'][1:-1].split("}")
	finally:
		t = threading.Thread(target=thread_complex,args=[services,ukey,sender_address])
		t.start()
