
all: compile

compile: server.cpp
	g++ -o server server.cpp -lboost_system -lpthread

run:
	./server 5500

clean:
	rm -f server *~