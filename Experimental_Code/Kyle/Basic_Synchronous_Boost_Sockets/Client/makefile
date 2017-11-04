
all: compile

compile: client.cpp
	g++ -o client client.cpp -lboost_system -lpthread

run:
	./client 127.0.0.1 5550

clean:
	rm -f client *~