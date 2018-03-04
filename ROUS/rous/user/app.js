var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var dgram = require('dgram'); 
var crypto = require('crypto');
var net = require('net');
var PythonShell = require('python-shell');

var http_port = process.env.PORT || 4242;
var mcast_port = 22400;
var tcp_port = 24242;
var mcast_host = "224.0.0.0";

var listener_data = [];
var nodes = [];
var items = 0;

var ukey = '../utils/keys/ukey.txt';
var script_encrypt = 'scripts/encrypt.py';
var script_decrypt = 'scripts/decrypt.py';
var decrypt = new PythonShell(script_decrypt);
var encrypt = new PythonShell(script_encrypt);



//## HTTP SERVER ##
function react_backend() {
	routes();
	console.log("\nstarting http server");
	app.listen(http_port);
}

function routes() {
	app.use(bodyParser.urlencoded({
    	extended: true
	}));
	
	app.get('/user', function(req, res) {
	    res.sendFile(__dirname + '/static/user.html');
	});

	app.get('/admin', function(req, res) {
	    res.sendFile(__dirname + '/static/admin.html');
	});

	app.get('/listenerdata', function(req, res) {
	  res.send({ data: listener_data() });
	});

	app.post('/sendmessage', function(req,res){
		// console.log(req.body.message);
		send_multicast_message(req.body.message);
	});

	app.post('/removetrust', function(req,res){
		var ip = req.body.message;
		console.log(ip);
		send_tcp_message(ip, "key, ukey, "+newkey())
	});

	app.get("/findnodes", function(req, res) {
		find_nodes();
		// res.send({ data: get_listener_data() });
	});
}
//#############




//## MULTICAST ##
function start_multicast_listener() {
	var listener = dgram.createSocket({type:'udp4',reuseAddr:true});
	listener.on('listening', function () {
	    var address = listener.address();	    
	    listener.setBroadcast(true);
	    listener.setMulticastTTL(128); 
	    listener.addMembership(mcast_host);
	});
	listener.on('message', function (message, remote) {

		console.log("\n"+message+"\n");

		decrypt.send(message);
		decrypt.send(JSON.stringify( {'ukey':ukey} ));
		decrypt.on('message', function(d_msg){ 
			// listener_data[items] = d_msg+','+remote.address+':'+remote.port;
		 //    items++;
			console.log(d_msg);
		});
		decrypt.end(); 
	});
	listener.bind(mcast_port);
}


function listener_data(){
	var data = listener_data;
	return data;
}


function send_multicast_message(message) {
	var server = dgram.createSocket({ type: 'udp4', reuseAddr: true });
	server.bind(mcast_port+1, function(){
    	server.setBroadcast(true);
    	server.setMulticastTTL(128);
    	server.addMembership(mcast_host);
	});
	encrypt.send(JSON.stringify( {'message':message,'ukey':ukey} ));
	encrypt.on('message', function(e_msg){
		server.send(e_msg, 0, e_msg.length, mcast_port, mcast_host);
	});
	encrypt.end();
	return;
}


function find_nodes() {
	send_multicast_message("whois");
	var count = 0;
	try {
		listener_data.forEach(function(data){
			var data = data.split(",");
			if(data[0] == "whois"){
				var ip = data[1].split(":")[0];
				if(nodes.length == 0){
					nodes[count] = ip;
					count++;
				}
				else{
					nodes.forEach(function(n_ip){
						if(ip != n_ip){
							nodes[count] = ip;
							count++;
						}
					});
				}
			}
		});
	}catch(error){ console.log(error+" - find nodes failed"); }
}
//#############




//## TCP ##
function send_tcp_message(IP, message) { 
	var client = new net.Socket();
	client.connect(tcp_port, IP.toString(), function() {
		client.write(message);
	});
}
//#############




//## UTILITIES ##
function newkey() { 
	return crypto.randomBytes(16).toString('hex');
}
//#############




react_backend();
start_multicast_listener();
