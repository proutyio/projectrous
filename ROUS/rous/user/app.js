var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var crypto = require('crypto');
var net = require('net');
var cors = require('cors')

var multicast = require('./multicast');
var tcp = require('./tcp');

var http_port = process.env.PORT || 4242;
var tcp_port = 24242;

var listener_data = [];
var nodes = [];
var items = 0;


app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 
}))


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
	  res.send(listener_data );
	});

	app.post('/sendmessage', function(req,res){
		multicast.sender(req.body.message);
	});

	app.post('/removetrust', function(req,res){
		var ip = req.body.message;
		console.log(ip);
		tcp.sender(ip, "key, ukey, "+newkey())
	});

	app.get("/findnodes", function(req, res) {
		find_nodes()
		res.send({ data: nodes });
	});
}


function find_nodes() {
	multicast.sender("whois");
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


function newkey() { 
	return crypto.randomBytes(16).toString('hex');
}





react_backend();
//multicast.listener(listener_data)
//find_nodes()
//start_multicast_listener();
