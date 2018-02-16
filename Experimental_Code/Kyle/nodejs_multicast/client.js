
var express = require('express');
var app = express();
var path = require('path');


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.listen(8080);





function run_webserver() {
	const http = require('http');

	const hostname = '127.0.0.1';
	const port = 3000;

	const server = http.createServer((req, res) => {
	  res.statusCode = 200;
	  res.setHeader('Content-Type', 'text/plain');
	  res.end('Hello World\n');
	});

	server.listen(port, hostname, () => {
	  console.log(`Server running at http://${hostname}:${port}/`);
	});
}


function multicast_listener() {
	var PORT = 41848;
	var MCAST_ADDR = "230.185.192.108"; //same mcast address as Server
	//var HOST = '192.168.0.3'; //this is your own IP
	var dgram = require('dgram');
	var client = dgram.createSocket({ type: 'udp4', reuseAddr: true });

	client.on('listening', function () {
	    var address = client.address();
	    console.log('UDP Client listening on ' + address.address + ":" + address.port);
	    client.setBroadcast(true)
	    client.setMulticastTTL(128); 
	    client.addMembership(MCAST_ADDR);
	});

	client.on('message', function (message, remote) {   
	    console.log('MCast Msg: From: ' + remote.address + ':' + remote.port +' - ' + message);
	});

	client.bind(PORT);
}