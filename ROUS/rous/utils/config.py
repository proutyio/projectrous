import ConfigParser
import imp
import rous.utils.utils as utils

path = "rous/node/configuration.ini"

#
def config_path(basepath):
	return utils.file_path(basepath)


# returns a config file object
def config_parser(file):
	config = ConfigParser.SafeConfigParser()
	config.read(file)
	return config


# scans config file and returns list of all
# 	the services that are defined
def all_services():
	config = config_parser( path )
	services = []
	for section in config.sections():
		for (function, file) in config.items(section): 
			if not (function == "file"): 
				services.append(function)
	return services


#
def call_service(service, sender_address):
	config = config_parser( config_path(path) )
	for section in config.sections():
		for (function, file) in config.items(section): 
			if(function == service):
				filepath = utils.file_path(file)
				module = imp.load_source(function, filepath)
				call_func = getattr(module, function) #the goods, magic is here
				call_func(sender_address)
				return True
	return False