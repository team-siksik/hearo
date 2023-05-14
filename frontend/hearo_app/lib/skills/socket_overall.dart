import 'package:socket_io_client/socket_io_client.dart' as so_io;

class SocketOverall {
  final so_io.Socket socket;

  SocketOverall()
      : socket = so_io.io('http://k8a6031.p.ssafy.io:80/', <String, dynamic>{
          'transports': ['websocket'],
          'autoConnect': false,
          'path': '/ws/socket.io',
        });

  void connect() {
    socket.open();
    print("소켓연결");
  }

  void disconnect() {
    socket.disconnect();
  }

  void enterRoom(String roomId) {
    socket.emit('enter_room', {'room_id': roomId});
    print("방 입장");
  }

  void closeRoom(String roomId) {
    socket.emit('close_room', {'room_id': roomId});
  }

  void sendMessageToRoom(String roomId, String message) {
    socket
        .emit('send_message_to_room', {'room_id': roomId, 'message': message});
    print(message);
    print("메세지보냄");
  }

  void onConnect(Function(dynamic) callback) async {
    socket.on('connect', (_) {
      print('connected');
      callback(_);
      print(socket.connected); // 연결 여부 확인
    });
    // print(socket.connected); // 연결 여부 확인
  }

  void onDisconnect(Function(dynamic) callback) {
    socket.on('disconnect', (data) {
      callback(data);
    });
  }

  void onInfo(Function(dynamic) callback) {
    socket.on('info', callback);
  }

  void onMessage(Function(dynamic) callback) {
    socket.on('message', (data) {
      callback(data);
    });
  }

  void sendClassification(String roomId, audioData) {
    socket.emit('classification', {'room_id': roomId, 'audio': audioData});
    print(audioData);
    print("오디오보냄");
  }

  getClassification() {
    socket.on("classification", (data) {
      print(data);
      return data;
    });
  }

  sendVideo(String roomId, String img64) {
    socket.emit('image', {'room_id': roomId, 'base64_string': img64});
    // print(img64);
    // print("영상보냄");
  }
}
