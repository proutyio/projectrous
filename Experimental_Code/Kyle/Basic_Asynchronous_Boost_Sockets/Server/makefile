all: server

server: async_server.cpp
	g++ -o async_server async_server.cpp -lboost_system -lpthread

run:
	./async_server 5800 &

clean:
	rm -f async_server *~
