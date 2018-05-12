#!/usr/bin/python
import sys
import signal
import commands
import socket
import struct
import re
import threading
import utils 
import config as configuration
import encryption

# both nodes and user use the below network function to listen and send 
#	multicast and tcp messages.

mcast_host = configuration.settings("mcast_host")
mcast_port = int(configuration.settings("mcast_port"))
tcp_port = int(configuration.settings("tcp_port"))


# make a fake internet query, grab hostname, close socket
# write ip to whitelist
# return ip
def find_my_ip():
	try:
		sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
		sock.connect(("1.1.1.1", 80))
		ip = sock.getsockname()[0]
		sock.close()
		utils.write_to_whitelist([ip],ip)#ignore message from myself
		return ip
	except:
		print "failed to find_my_ip"


#
def start_multicast_receiver(address):
	server_address = ('', mcast_port)
	sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	sock.bind(server_address)
	sock.setsockopt(socket.IPPROTO_IP, 
                    socket.IP_ADD_MEMBERSHIP, 
                    struct.pack('4sL', socket.inet_aton(mcast_host), socket.INADDR_ANY)
                    )
	return sock



#
def send_multicast_message(message, key, address):
	try:
		multicast_group = (mcast_host, mcast_port)
		sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
		sock.setsockopt(socket.IPPROTO_IP, 
						socket.IP_MULTICAST_TTL, 
						struct.pack('b', 1)
						)
		encrypt_message = encryption.encrypt(str(message), key)
		sent = sock.sendto(encrypt_message, multicast_group)
		sock.close()		
	except:
		log.error("%s - FAILED to send: %s", address, message)



# format: ("tag", "keytype", "newkey")
def thread_tcp_server():
	host = find_my_ip()
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	server_address = (host, tcp_port)
	sock.bind(server_address)
	sock.listen(1)
	while True:
		conn, address = sock.accept()
		try:
			data = conn.recv(1024)
			if(data == "stop"): 
				break
			elif (data == "key"):
				update_key(data, host)
				break
			elif (data == "print"):
				receive_print(data, conn)
		finally:
			conn.close()

	
#
def receive_print(data, conn):
	try:
		msg = data.split(",")
		byteAmount = msg[1]
		conn.send("received initial amount")
		fileContents = conn.recv(byteAmount)
		fileObject = open("rous/utils/m.txt", "w")
		fileObject.write(str(fileContents))
		fileObject.close()
		services.print_file(conn)
	except:
		print "failed to receive/print"




# writes a new key to the key file
def update_key(data, host):
	try:
		msg = data.split(",")
		if msg[0] == "key":
			if msg[1].strip() == "ukey": 
				key = utils.ukey()	    				
				newkey = msg[2].strip()
				if len(newkey) == 32:
					utils.write_new_key(key, newkey, host)
	except:
		print "failed to update_key"



#
def start_tcp_server(address):
    t = threading.Thread(target=thread_tcp_server)
    t.start()



# send message to myself, I use this to stop the tcp server thread
#	with a "stop" message 
def send_tcp_message(host,message):
	# try:
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	server_address = (host, tcp_port)
	sock.connect(server_address)
	try:
		data = message
		sock.sendall(data)
	finally:
		sock.close()
		return












# def find_ip_from_string(str):
#     try:
#         ip = re.findall(r'[0-9]+(?:\.[0-9]+){3}',str)
#         return ip
#     except:
#         log.error("Failed to parse IP from string")



# def parse_ip_list(lst):
#     ip_list = []
#     try:
#         for node in lst:
#             ip = find_ip_from_string(node[1])
#             ip_list.append(ip)
#         return ip_list
#     except:
#         log.error("Failed parsing IP list")



# def scan_subnet():
#     try:
#         log.info("- Scanning subnet range... -")
#         commands.getstatusoutput('nmap -sP 192.168.0.1/24')
#     except:
#         log.error("Failed to scan subnet")



# #returns list of nodes
# def find_rpi_nodes():
#     nodes = []
#     try:
#         for item in mac_list:
#             cmd = 'arp -na | grep -i '+item
#             nodes.append(commands.getstatusoutput(cmd))
#         return nodes
#     except:
#         log.error("Failed when trying to find RPi nodes")



# def discover_nodes():    
#     scan_subnet()
#     nodes = find_rpi_nodes()
#     print nodes
#     ip_list = parse_ip_list(nodes)
#     return ip_list



# arp request taken from
# https://raspberrypi.stackexchange.com/questions/13936/find-raspberry-pi-address-on-local-network

# regex IP string expression taken from
# https://stackoverflow.com/questions/2890896/extract-ip-address-from-an-html-string-python

# extract IP taken from
# https://unix.stackexchange.com/questions/87468/is-there-an-easy-way-to-programmatically-extract-ip-address
