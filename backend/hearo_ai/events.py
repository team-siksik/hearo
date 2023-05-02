from flask import session
from flask_socketio import emit, join_room, leave_room


def socketio_init(socketio):
    @socketio.on('joined', namespace='/chat')
    def joined(message):
        room = session.get('room')
        join_room(room)
        emit('status', {'msg': session.get('username') + '님이 입장하셨습니다'}, room=room)


    @socketio.on('text', namespace='/chat')
    def text(message):
        room = session.get('room')
        emit('message', {'msg': session.get('username') + ':' + message['msg']}, room=room)


    @socketio.on('left', namespace='/chat')
    def left(message):
        room = session.get('room')
        leave_room(room)
        emit('status', {'msg': session.get('username') + '님이 퇴장하셨습니다'}, room=room)
