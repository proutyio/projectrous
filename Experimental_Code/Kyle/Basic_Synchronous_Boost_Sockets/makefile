all: server client

server: Server/server.cpp
	g++ -o Server/server Server/server.cpp -lboost_system -lpthread

client: Client/client.cpp
	g++ -o Client/client Client/client.cpp -lboost_system -lpthread


run:
	./Server/server 5800 &
	./Client/client 127.0.0.1 5800

clean:
	rm -f Server/server *~
	rm -f Client/client *~