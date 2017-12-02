all: server

server: Server/async_server.cpp
	g++ -o Server/async_server Server/async_server.cpp -lboost_system -lpthread

run:
	./Server/async_server 5800 &

clean:
	rm -f Server/async_server *~
