var express = require('express');
var app = express();
var port = process.env.PORT || 4242;


function react_backend() {
	routes();
	app.listen(port, () => console.log(`Listening on port ${port}`));
}
react_backend();



function routes() {
	app.get('/user', function(req, res) {
	    res.sendFile(__dirname + '/static/user.html');
	});

	app.get('/admin', function(req, res) {
	    res.sendFile(__dirname + '/static/admin.html');
	});

	app.get('/test', function(req, res) {
	  res.send({ test: 'test' });
	});

	app.post('/sendmessage', function(req,res){
		console.log("working");
	});
}


function multicast_listener() {
	var port = 22400;
	var host = "224.0.0.0";
	var dgram = require('dgram');
	var listener = dgram.createSocket({type:'udp4',reuseAddr:true});

	listener.on('listening', function () {
	    var address = listener.address();
	    console.log('Listening on: '+address.address+":"+address.port);
	    
	    listener.setBroadcast(true)
	    listener.setMulticastTTL(128); 
	    listener.addMembership(host);
	});

	listener.on('message', function (message, remote) {   
	    console.log('RECIEVED: '+message+'\tFROM: '+remote.address+':'+remote.port);
	});
	listener.bind(port);
}
multicast_listener();