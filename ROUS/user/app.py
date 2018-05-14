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
import time
import ROUS.user.utils.utils as utils 
import ROUS.user.utils.config as configuration
import ROUS.user.utils.network as network
import ROUS.user.utils.encryption as encryption

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

# web socket functions. they listen for keywords and can emit messages
#	back to the sender. This is the functionality that updates the 
#	react frontend interface with data. Functions to pass data to the 
# 	via web sockets and listen for multicast message using the same
#	python functions that the nodes use.
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
	io.emit("updatetime")
	time.sleep(2)
	network.send_multicast_message(message,ukey,self_ip)
	


@io.on('complex_send')
def complex_send(msg_lst):
	io.emit("updatetime")
	time.sleep(2)
	message = build_complex(msg_lst)
	network.send_multicast_message(message,ukey,self_ip)
	

#
@io.on("erase_data")
def erase_data():
	mutex.acquire()
	try:
		del data[:]
		del console_data[:]
	finally:
		mutex.release()

@io.on("clearall")
def clear_all():
	network.send_multicast_message(
		'{"tag":"clearall","address":"'+self_ip+'"}',ukey,self_ip)



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
			# network.send_tcp_message('192.168.0.102',"key,ukey,"+newkey)
			# network.send_tcp_message('192.168.0.103',"key,ukey,"+newkey)
			# network.send_tcp_message('192.168.0.104',"key,ukey,"+newkey)
			# network.send_tcp_message('192.168.0.105',"key,ukey,"+newkey)
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
				utils.write_new_key(utils.ukey(),newkey,self_ip)


# build then return a json string for complex jobs. takes a
#	list of single services.
def build_complex(msg_lst):
	msg = '['
	for m in msg_lst:
		msg+=''+m+','
	msg = msg[:-1]+']'
	msg = '{"tag":"service","service":"complex","services":'+json.dumps(msg)+'}'
	return msg


# sits in a thread and listens for multicast messages. this is
#	how all data is collected to send to fontend
# lots of try except so I can allow some cases to be able to fail
def thread_listener(sock, address):
	while True:
		message, (host,port) = sock.recvfrom(1024)
		if message:
			msg = encryption.decrypt(message, ukey)
			try:
				tag = json.loads(msg)['tag']
				if tag == "stop": 
					break
				if (tag == "winner" or 
					tag == "bidding" or 
					tag == "waiting"):
						io.emit("update_console", [msg])
				if tag == "clearall":
					io.emit("clearall")
				if tag == "timevalue":
					io.emit("updatetime")
			except: pass
			mutex.acquire()
			try:
				data.append(msg) 
			except:
				pass 
			finally:
				mutex.release()

# mutlicast listen, threaded
def listener():
	sock = network.start_multicast_receiver(self_ip)
	t = Thread(target=thread_listener, args=(sock, self_ip))
	t.start()
	return t


# parses through the captured mutlicast data and finds all the nodes
#	by their IP and then return the full json string in a list of nodes
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


