from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
import sys
import socket
import threading

import rous.utils.utils as utils
import rous.utils.network as network
import rous.utils.encryption as encryption

app = Flask(__name__)
CORS(app)

self_ip = network.find_my_ip()
ukey = "../utils/keys/ukey.txt"
# akey = utils.akey()


@app.route("/listenerdata")
def listener_data():
    return "listener"

@app.route("/sendmessage")
def send_message():
	network.send_multicast_message("info, ",ukey,self_ip)
	return "send message"


@app.route("/removetrust")
def remove_trust():
    return "Hello World!"


@app.route("/findnodes")
def find_nodes():
    return "Hello World!"




def thread_listener(sock, address):
	while True:
		message, (host,port) = sock.recvfrom(1024)

		if message:
			msg = encryption.decrypt(message, ukey)
			print msg


def listener():
	sock = network.start_multicast_receiver(self_ip)
	t = threading.Thread(target=thread_listener, args=(sock, self_ip))
	t.start()
listener()
