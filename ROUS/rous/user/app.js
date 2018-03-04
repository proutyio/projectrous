var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var crypto = require('crypto');
var net = require('net');

var http_port = process.env.PORT || 4242;
var mcast_port = 22400;
var tcp_port = 24242;
var mcast_host = "224.0.0.0";

var dgram = require('dgram'); 
var listener_data = [];
var items = 0;



//## HTTP SERVER ##
function react_backend() {
	routes();
	console.log("\nstarting http server")
	app.listen(http_port);
}
react_backend();

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
	  res.send({ data: get_listener_data() });
	});

	app.post('/sendmessage', function(req,res){
		console.log(req.body.message);
		multicast_sender(req.body.message);
	});

	app.post('/removetrust', function(req,res){
		var ip = req.body.message
		console.log(ip);
		send_tcp_message(ip, "key, ukey, "+newkey())
	});
}
//#############




//## MULTICAST ##
function multicast_listener() {
	var listener = dgram.createSocket({type:'udp4',reuseAddr:true});
	listener.on('listening', function () {
	    var address = listener.address();	    
	    listener.setBroadcast(true)
	    listener.setMulticastTTL(128); 
	    listener.addMembership(mcast_host);
	    //console.log('Listening on: '+address.address+":"+address.port);
	});
	listener.on('message', function (message, remote) {   
	    //console.log('RECIEVED: '+message+'\tFROM: '+remote.address+':'+remote.port);
	    listener_data[items] = message+','+remote.address+':'+remote.port;
	    items++;
	});
	listener.bind(mcast_port);
}
//multicast_listener();

function listener_data(){
	var data = listener_data;
	return data;
}

function multicast_sender(message) {
	var server = dgram.createSocket({ type: 'udp4', reuseAddr: true });
	server.bind(mcast_port+1, function(){
    	server.setBroadcast(true);
    	server.setMulticastTTL(128);
    	server.addMembership(mcast_host);
	});
	server.send(message, 0, message.length,mcast_port,mcast_host);	
	return;
}
//#############




//## TCP ##
function send_tcp_message(IP, message) { 
	var client = new net.Socket();
	client.connect(24242, '192.168.0.3', function() {
		console.log('Connected');
		client.write(message);
	});
	//client.destroy();
}
//#############




//## UTILITIES ##
function newkey() { 
	return crypto.randomBytes(16).toString('hex');
}
//#############
