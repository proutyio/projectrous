
all: compile

compile: client.cpp
	g++ -o client client.cpp -lboost_system -lpthread

run:
	./client

clean:
	rm -f client *~