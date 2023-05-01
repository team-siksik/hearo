from flask import session
from flask_socketio import emit


def socketio_init(socketio):

    @socketio.on('connect', namespace='/conversation')
    def connect(message):
        room = session.get('room')
        emit('connect', {'msg': session.get('name') + 'connected'}, room=room)

    @socketio.on('disconnect', namespace='/conversation')
    def disconnect(message):
        room = session.get('room')
        emit('disconnect', {'msg': session.get(
            'name') + 'disconnected'}, room=room)
