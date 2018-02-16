import socket, select, Queue

from flask import Flask
from celery import Celery


def make_celery(app):
    celery = Celery(app.import_name, broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    TaskBase = celery.Task
    class ContextTask(TaskBase):
        abstract = True
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery.Task = ContextTask
    return celery

app = Flask(__name__)
app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379'
)
celery = make_celery(app)
socket_queue = Queue.Queue()


@celery.task()
def listen_to_udp():
    """
    This code was taken from 
    https://stackoverflow.com/questions/9969259/python-raw-socket-listening-for-udp-packets-only-half-of-the-packets-received
    """
    s1 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s1.bind(('localhost', 10000))
    while True:
        data = s1.recvfrom(1024)
        print data

@app.route("/")
def test_home():
    listen_to_udp.delay()
    print(socket_queue.get())

if __name__ == "__main__":
    #run install.py to install dependencies and create the database
    app.run(host="localhost", port=10000, debug=True)