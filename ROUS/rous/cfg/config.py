import ConfigParser
import imp

path = "default.ini"


# returns a config file object
def configparser(file):
	config = ConfigParser.SafeConfigParser()
	config.read(file)
	return config



# scans config file and returns list of all
# 	the services that are defined
def all_services():
	config = configparser(path)
	services = []
	for section in config.sections():
		for (function, file) in config.items(section): 
			if not (function == "file"): 
				services.append(function)
	return services



#
def call_service(service, sender_address):
	config = configparser(path)
	for section in config.sections():
		for (function, file) in config.items(section): 
			if (function == service):
				obj = imp.load_source(function, file)
				# this calls the function
				getattr(obj, function)(sender_address)
