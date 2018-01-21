import socket
import sys

host_list = ['192.168.0.100','192.168.0.101'] 
port = 22000


def send_message(message):
	sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	try:
		for host in host_list:
			sent = sock.sendto(message, (host, port))

	finally:
		sock.close()


def start_gui():
	try:	
		while exit:
			print
			print "Option 1: Green ON"
			print "Option 2: Green OFF"
			print "Option 3: Yellow ON"
			print "Option 4: Yellow OFF"
			print "Option 5: All Colors ON"
			print "Option 6: All Colors OFF"
			print 


			services = {1 : "led:solid:green:on",
						2 : "led:solid:green:off",
						3 : "led:solid:yellow:on",
						4 : "led:solid:yellow:off",
						5 : "led:all:on",
						6 : "led:all:off",
						}

			send_message(services[int(input("Choose an option: "))])
	except:
		print "GUI Failed.."


start_gui()