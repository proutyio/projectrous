from flask import Flask
from flask_socketio import SocketIO, emit
from flask import request
from flask_cors import CORS, cross_origin
from threading import Thread, Lock
from functools import partial
import sys
import socket
import json
import signal
import rous.utils.utils as utils
import rous.utils.network as network
import rous.utils.encryption as encryption

from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
io = SocketIO(app)

CORS(app)

self_ip = network.find_my_ip()
ukey = "../utils/keys/ukey.txt"

data = []
nodes = []
mutex = Lock()



#
@io.on('connect')
def connected():
	emit("connection")
	print "%s connected" % (request.sid)

#
@io.on('disconnect')
def disconnect():
	emit("disconnect")
	print "%s disconnected" % (request.sid)


#
# @io.on('change_color')
# def change_color(color):
# 	print "change_color"
# 	print color
# 	emit('hello')


#
@io.on('whois')
def discover_nodes():
	find_nodes()
	emit("discover_nodes", nodes)


#
@io.on('send')
def send_message(message):
	print message
	network.send_multicast_message(message,ukey,self_ip)
	# network.send_multicast_message(
		# '{"tag":"'+tag+'","message":"'+message+'","address":"'+self_ip+'"}',ukey,self_ip)


#
@io.on('console')
def update_console():
	mutex.acquire()
	try:
		emit("update_console", data)
	finally:
		mutex.release()



# #
# @app.route("/sendmessage")
# def send_message():
# 	network.send_multicast_message(
# 		'{"tag":"info","message":" ","address":"'+self_ip+'"}',ukey,self_ip)
# 	return "send message"


# #
# @app.route("/removetrust")
# def remove_trust():
#     return "removetrust"


# #
# @app.route("/findnodes")
# def discover():
# 	find_nodes()
# 	return json.loads(json.dumps(nodes))

#
def thread_listener(sock, address):
	while True:
		message, (host,port) = sock.recvfrom(1024)
		if message:
			msg = encryption.decrypt(message, ukey)
			# if json.loads(msg)['tag'] == "stop": 
			# 	break
			mutex.acquire()
			try:
				print data
				data.append(msg)
			finally:
				mutex.release()

#
def listener():
	sock = network.start_multicast_receiver(self_ip)
	t = Thread(target=thread_listener, args=(sock, self_ip))
	t.start()
	return t


#
def find_nodes():
	network.send_multicast_message(
		'{"tag":"whois","address":"'+self_ip+'"}',ukey,self_ip)
	mutex.acquire()
	try:
		del nodes[:]
		if data:
			for d in data:
				d = json.loads(d)
				if d['tag'] == "info" and d['message'] == "whois":
					if not nodes:
						nodes.append(json.dumps(d))
					else:
						for n in nodes:
							n = json.loads(n)
							if d['address'] != n['address']:
								nodes.append(json.dumps(d))
	except:
		pass
	finally:
		del data[:]
		mutex.release()


#
def handle_ctrl_c(signal, frame):
    print "\nSIGNAL: ctrl c"
    network.send_multicast_message('{"tag":"stop"}',ukey,self_ip)
    sys.exit(0)



#	START
###############################################
listener()
signal.signal(signal.SIGINT, partial(handle_ctrl_c))
###############################################