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
import rous.utils.config as configuration
import rous.utils.network as network
import rous.utils.encryption as encryption

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app)
io = SocketIO(app)

self_ip = network.find_my_ip()
ukey = str(configuration.settings("frontend_key"))


data = []
console_data = []
nodes = []
removed = []
wait_nodes = []
bid_nodes = []
win_nodes = []
check_nodes = []
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
@io.on('whois')
def discover_nodes():
	find_nodes()
	sorted_nodes = sorted(nodes, key=lambda n: json.loads(n)['address'], reverse=False)
	emit("discover_nodes", sorted_nodes)

#
@io.on('send')
def send_message(message):
	print message
	network.send_multicast_message(message,ukey,self_ip)


@io.on('complex_send')
def complex_send(msg_lst):
	message = build_complex(msg_lst)
	network.send_multicast_message(message,ukey,self_ip)

#
@io.on('console')
def update_console():
	mutex.acquire()
	try:
		emit("update_console", console_data)
	finally:
		mutex.release()


#
@io.on("erase_data")
def erase_data():
	mutex.acquire()
	try:
		del data[:]
		del console_data[:]
	finally:
		mutex.release()


# when restoring I want to issue new keys to removed list + found nodes
# lot of error checking, looks nasty, sorry
@io.on('trust')
def remove_trust(block_ip):
	find_nodes()
	newkey = str(encryption.newkey())
	removed.append(block_ip)
	if block_ip == str(0): #restore keys to all
		# network.send_tcp_message(self_ip,"key,ukey,"+newkey)
		utils.write_new_key(utils.ukey(),newkey,self_ip)
		try:
			for r in removed:
				if r != str(0):
					network.send_tcp_message(r,"key,ukey,"+newkey)
		except: pass
		if nodes:
			for n in nodes:
				node_ip = json.loads(n)['address']
				network.send_tcp_message(node_ip,"key,ukey,"+newkey)
	elif nodes: #remove key for selected node
		if block_ip != self_ip: #issues new key to myself
			network.send_tcp_message(self_ip,"key,ukey,"+newkey)
		for n in nodes: #issue new keys to all nodes but untrusted
			node_ip = json.loads(n)['address']
			if block_ip != node_ip:
				network.send_tcp_message(node_ip,"key,ukey,"+newkey)


#
def build_complex(msg_lst):
	msg = '['
	for m in msg_lst:
		msg+=''+m+','
	msg = msg[:-1]+']'
	msg = '{"tag":"service","service":"complex","services":'+json.dumps(msg)+'}'
	return msg


# lots of try except so I can allow some cases to be able to fail
def thread_listener(sock, address):
	while True:
		message, (host,port) = sock.recvfrom(1024)
		if message:
			msg = encryption.decrypt(message, ukey)
			try:
				if json.loads(msg)['tag'] == "stop": break
			except: pass
			mutex.acquire()
			try:
				data.append(msg) 
				if json.loads(msg)['tag']!="whois" and json.loads(msg)['message']!="whois":
					console_data.append(msg) 
			except: 
				try:
					if json.loads(msg)['tag']!="whois":
						console_data.append(msg)
				except: pass
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
					if nodes:
						check = False
						for n in nodes:
							n = json.loads(n)
							if str(d['address']) == str(n['address']):
								check = True
								break
						if not check:
							nodes.append(json.dumps(d))
					else:
						nodes.append(json.dumps(d))
	except:
		pass
	finally:
		del data[:]
		del console_data[:]
		mutex.release()



#
def handle_ctrl_c(signal, frame):
    print "\nSIGNAL: ctrl c"
    network.send_multicast_message('{"tag":"stop"}',ukey,self_ip)
    network.send_tcp_message(self_ip,"stop")
    sys.exit(0)



#	START
###############################################
listener()
network.start_tcp_server(self_ip)
signal.signal(signal.SIGINT, partial(handle_ctrl_c))
###############################################


