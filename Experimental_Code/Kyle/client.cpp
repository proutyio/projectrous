/*
*	Author: 	Kyle Prouty
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

int setup_client();


int main(int argc, char* argv[])
{

	if(setup_client()){
		cout << "\n\tSetup Succesful\n";
	} else {
		cerr << "\n\tSetup failed!\n\n";
	}
}

int setup_client() {
	try {

		/*
		*	setup
		*/
		boost::asio::io_service io_service; //to use asio library, need at least one io_service object
		tcp::resolver resolver(io_service); //TCP endpoint
		tcp::resolver::query query("text","more text"); //resolver takes query object and turns it into list of endpoints
		tcp::resolver::iterator end_itr = resolver.resolve(query); //endpoints are returned as iterator object

		/*
		*	open connection on socket
		*/
		tcp::socket socket(io_service);
		connect(socket, end_itr);

		/*
		*	We use a boost::array to hold the received data. The boost::asio::buffer() function 
		*	automatically determines the size of the array to help prevent buffer overruns. 
		*	Instead of a boost::array, we could have used a char [] or std::vector.
		*/
		for (;;) {
			boost::array<char, 128> buf;
			boost::system::error_code error;

			size_t len = socket.read_some(boost::asio::buffer(buf), error);
			if (error == boost::asio::error::eof)
				break; // Connection closed cleanly by peer.
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