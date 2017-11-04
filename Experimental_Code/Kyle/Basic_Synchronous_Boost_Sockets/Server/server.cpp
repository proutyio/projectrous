/*
*	Author: 	Kyle Prouty - Fall 2017
*
*	Subject:	C++ socket experiments 
*				Server
*
*
*	References:
*	http://www.boost.org/doc/libs/1_55_0/doc/html/boost_asio/tutorial/tutdaytime1.html
*
*/

#include <iostream>
#include <boost/asio.hpp>
#include <string>

using namespace std;
using namespace boost::asio::ip;

int setup_server(int);



int main(int argc, char* argv[])
{
	int port = atoi(argv[1]);

	if(setup_server(port)){
		cout << "\n\tServer setup succesful\n";
	} else {
		cerr << "\n\tServer setup failed!\n\n";
	}
}

int setup_server(int port) {
	try {
		/*
		*	setup
		*/
		boost::asio::io_service io_service;
		tcp::acceptor acceptor(io_service, tcp::endpoint(tcp::v4(), port));

		/*
		*	Will only handle one connection at a time.
		*/
		for (;;)
		{
			tcp::socket socket(io_service);
			acceptor.accept(socket);
			string message = "\n\tData sent from SERVER. Success!\n";

			boost::system::error_code ignored_error;
			boost::asio::write(socket, boost::asio::buffer(message), ignored_error);
		}

		return 1;
	}  catch (exception& e) {
		cerr <<"\n\t"<< e.what() << "\n";
		return 0;
	}


}