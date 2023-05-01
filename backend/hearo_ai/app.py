from flask import Flask
from flask_socketio import SocketIO

from events import socketio_init
from routes import main as main_blueprint


socketio = SocketIO(logger=True, engineio_logger=True)

app = Flask(__name__)
app.debug = True
app.secret_key= 'hearo manse'

socketio.init_app(app)
socketio_init(socketio)  # for Socket
app.register_blueprint(main_blueprint)  # for HTTP

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=8090)
