var dgram = require('dgram'); 
var PythonShell = require('python-shell');

var mcast_port = 22400;
var mcast_host = "224.0.0.0";

var ukey = '../utils/keys/ukey.txt';
var script_encrypt = 'scripts/encrypt.py';
var script_decrypt = 'scripts/decrypt.py';
var decrypt = new PythonShell(script_decrypt);
var encrypt = new PythonShell(script_encrypt);


module.exports = 
{
	listener: function () {
		var listener = dgram.createSocket({type:'udp4',reuseAddr:true});
		listener.on('listening', function () {
		    var address = listener.address();	    
		    listener.setBroadcast(true);
		    listener.setMulticastTTL(128); 
		    listener.addMembership(mcast_host);
		});
		listener.on('message', function (message, remote) {
			decrypt.send(message);
			decrypt.send(JSON.stringify( {'ukey':ukey} ));
			decrypt.on('message', function(d_msg){ 
				listener_data[items] = d_msg+','+remote.address+':'+remote.port;
			    items++;
				console.log(d_msg);
			});
			decrypt.end(); 
		});
		listener.bind(mcast_port);
	},

	sender: function(message) {
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
};