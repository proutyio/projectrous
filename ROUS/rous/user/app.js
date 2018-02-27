var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 4242;
var mcast_port = 22400;
var mcast_host = "224.0.0.0";
var dgram = require('dgram'); 


//## http server ########################################

function react_backend() {
	routes();
	app.listen(port, () => console.log(`Listening on port ${port}`));
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

	app.get('/test', function(req, res) {
	  res.send({ test: 'test' });
	});

	app.post('/sendmessage', function(req,res){
		console.log(req.body.message);
		multicast_sender(req.body.message);
	});
}



//## multicast socket ########################################

function multicast_listener() {
	var listener = dgram.createSocket({type:'udp4',reuseAddr:true});

	listener.on('listening', function () {
	    var address = listener.address();	    
	    listener.setBroadcast(true)
	    listener.setMulticastTTL(128); 
	    listener.addMembership(mcast_host);
	    console.log('Listening on: '+address.address+":"+address.port);
	});

	listener.on('message', function (message, remote) {   
	    console.log('RECIEVED: '+message+'\tFROM: '+remote.address+':'+remote.port);
	});
	listener.bind(mcast_port);
}
//multicast_listener();



function multicast_sender(message) {
	var server = dgram.createSocket({ type: 'udp4', reuseAddr: true });
	server.bind(22401, function(){
    	server.setBroadcast(true);
    	server.setMulticastTTL(128);
    	server.addMembership(mcast_host);
	});
	server.send(message, 0, message.length,mcast_port,mcast_host);	
}