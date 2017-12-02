/*
*	Author: 	Kyle Prouty - Fall 2017
*
*	Subject:	C++ socket experiments 
*				Async Server, requires async_tcp_server.h
*
*
*	References:
*	http://www.boost.org/doc/libs/1_55_0/doc/html/boost_asio/tutorial/
*
*/
int main()
{
try
{
boost::asio::io_service io_service;
tcp_server server(io_service);

io_service.run();
}
catch (std::exception& e)
{
std::cerr << e.what() << std::endl;
}

return 0;
}