from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
from threading import Thread, Lock
import sys
import socket
import json

import rous.utils.utils as utils
import rous.utils.network as network
import rous.utils.encryption as encryption

app = Flask(__name__)
CORS(app)

self_ip = network.find_my_ip()
ukey = "../utils/keys/ukey.txt"

data = []
nodes = []
mutex = Lock()


#
@app.route("/listenerdata")
def listener_data():
	mutex.acquire()
	try:
		return json.dumps(data)
	finally:
		mutex.release()


#
@app.route("/sendmessage")
def send_message():
	network.send_multicast_message("info, ",ukey,self_ip)
	return "send message"


#
@app.route("/removetrust")
def remove_trust():
    return "removetrust"


#
@app.route("/findnodes")
def discover():
	find_nodes()
	return json.dumps(nodes)


#
def thread_listener(sock, address):
	while True:
		message, (host,port) = sock.recvfrom(1024)
		if message:
			msg = encryption.decrypt(message, ukey)
			mutex.acquire()
			try:
				data.append(msg)
			finally:
				mutex.release()

#
def listener():
	sock = network.start_multicast_receiver(self_ip)
	t = Thread(target=thread_listener, args=(sock, self_ip))
	t.start()
listener()


#
def find_nodes():
	network.send_multicast_message("whois, "+self_ip,ukey,self_ip)
	mutex.acquire()
	try:
		if data:
			for msg in data:
				if msg.split(",")[0] == "whois":
					ip = msg.split(",")[1]
					if nodes:
						for n in nodes:
							if ip != n:
								nodes.append(ip)
					else:
						nodes.append(ip)
	finally:
		mutex.release()