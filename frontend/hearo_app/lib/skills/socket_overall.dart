import 'package:get/get.dart';
import 'package:hearo_app/controller/login_controller.dart';
import 'package:socket_io_client/socket_io_client.dart' as so_io;

LoginController loginController = Get.put(LoginController());

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

  void enterRoom() {
    socket.emit('enter_room', {'room_id': loginController.myCode.value});
    print("방 입장");
  }

  void closeRoom() {
    socket.emit('close_room', {'room_id': loginController.myCode.value});
  }

  void sendMessageToRoom(String message) {
    socket.emit('send_message_to_room',
        {'room_id': loginController.myCode.value, 'message': message});
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

  void sendClassification(audioData) {
    socket.emit('classification',
        {'room_id': loginController.myCode.value, 'audio': audioData});
    print(audioData);
    print("오디오보냄");
  }

  void getClassification() {
    socket.on("result", (data) {
      return data;
    });
  }

  void getSignLang() {
    socket.on("word", (data) {
      print("$data, @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      return data;
    });
  }

  sendVideo(String img64) {
    socket.emit('image',
        {'room_id': loginController.myCode.value, 'base64_string': img64});
  }
}
