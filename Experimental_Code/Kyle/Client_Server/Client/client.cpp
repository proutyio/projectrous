/*
*	Author: 	Kyle Prouty - Fall 2017
*
*	Subject:	C++ socket experiments 
*				Client
*
*
*	References:
*	http://www.boost.org/doc/libs/1_55_0/doc/html/boost_asio/tutorial/tutdaytime1.html
*
*/

#include <iostream>
#include <exception>
#include <boost/array.hpp>
#include <boost/asio.hpp>

using namespace std;
using namespace boost::asio::ip;

int setup_client(char*,char*);


int main(int argc, char* argv[])
{
	/*
	*	TODO: error checking params
	*/
	char* address = argv[1];
	char* port = argv[2];

	if(setup_client(address, port)){
		cout << "\n\tSuccesfully received data from server!\n";
	} else {
		cerr << "\n\tClient setup failed!\n\n";
	}

}

int setup_client(char* address, char* port) {
	try {
		/*
		*	setup
		*/
		boost::asio::io_service io_service; 
		tcp::resolver resolver(io_service); 
		tcp::resolver::query query(address, port); 
		tcp::resolver::iterator end_itr = resolver.resolve(query); 

		
		/*
		*	open connection on socket
		*/
		tcp::socket socket(io_service);
		connect(socket, end_itr);

		
		/*
		*	Read buffer from server
		*/
		for (;;) {
			boost::array<char, 128> buf;
			boost::system::error_code error;

			size_t len = socket.read_some(boost::asio::buffer(buf), error);
			if (error == boost::asio::error::eof)
				break; // Connection closed cleanly by peer
			else if (error)
				throw boost::system::system_error(error); // Some other error.
			cout.write(buf.data(), len);
		}

		return 1;
	}  catch (exception& e) {
		cerr <<"\n\t"<< e.what() << "\n";
		return 0;
	}

}