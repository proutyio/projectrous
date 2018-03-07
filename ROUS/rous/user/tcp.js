
var sender = function(IP, message) { 
	var client = new net.Socket();
	client.connect(tcp_port, IP.toString(), function() {
		client.write(message);
	});
}