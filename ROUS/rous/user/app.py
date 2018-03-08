from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)


@app.route("/user")
def hello():
    return "Hello World!"


@app.route("/listenerdata")
def listener_data():
    return "Hello World!"