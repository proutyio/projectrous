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
@io.on('connected')
def connected():
    print "%s connected" % (request.sid)


#
@io.on('disconnect')
def disconnect():
    print "%s disconnected" % (request.sid)


#
@io.on('change_color')
def change_color(color):
	print "change_color"
	print color
	emit('hello')


#
@io.on('discover_nodes')
def discover_nodes():
	find_nodes()
	emit("discover_nodes", json.dumps(nodes))


#
@app.route("/sendmessage")
def send_message():
	network.send_multicast_message(
		'{"tag":"info","message":" ","address":"'+self_ip+'"}',ukey,self_ip)
	return "send message"


#
@app.route("/removetrust")
def remove_trust():
    return "removetrust"


#
@app.route("/findnodes")
def discover():
	find_nodes()
	return json.loads(json.dumps(nodes))


#
def thread_listener(sock, address):
	while True:
		message, (host,port) = sock.recvfrom(1024)
		if message:
			if message == "stop": 
				break
			msg = encryption.decrypt(message, ukey)
			mutex.acquire()
			try:
				print json.loads(msg)["tag"]
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
	network.send_multicast_message("whois",ukey,self_ip)
	mutex.acquire()
	try:
		del nodes[:]
		if data:
			for d in data:
				msg = d.split(',')
				if msg[0] == "info":
					if msg[1].strip() == "whois":
						ip = msg[2].strip()
						if nodes:
							for n in nodes:
								if (str(ip) != str(n)):
									nodes.append(ip)
						else:
							nodes.append(ip)
	except:
		pass
	finally:
		del data[:]
		mutex.release()


#
def handle_ctrl_c(l, signal, frame):
    print "\nSIGNAL: ctrl c"
    network.send_multicast_message("stop",ukey,self_ip)
    l.join()
    sys.exit(0)



#	START
###############################################
l = listener()
signal.signal(signal.SIGINT, partial(handle_ctrl_c, l))
# io.run(app, host='0.0.0.0', port=4242, debug=True)
# socketio.run(app)
###############################################