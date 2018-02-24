var express = require('express');
var app = express();
var port = process.env.PORT || 8002;



function react_backend() {
	app.get('/test', (req, res) => {
	  res.send({ test: 'test' });
	});

	// app.get('/', function(req, res) {
	//     res.sendFile(path.join(__dirname + '/static/index.html'));
	// });

	app.listen(port, () => console.log(`Listening on port ${port}`));
}
react_backend();



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