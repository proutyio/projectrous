import socket
import sys


host = 'localhost'
port = 5000
server_address = (host, port)

message = "led:blink:green"


def send_message():

	print "Sending: ",message

	sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	try:
		sent = sock.sendto(message, server_address)

	finally:
		sock.close()


send_message()