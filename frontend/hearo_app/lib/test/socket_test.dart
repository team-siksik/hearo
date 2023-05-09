import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as so_io;

class SocketTest extends StatefulWidget {
  const SocketTest({super.key});

  @override
  State<SocketTest> createState() => _SocketTestState();
}

class _SocketTestState extends State<SocketTest> {
  final so_io.Socket socket =
      so_io.io('http://k8a6031.p.ssafy.io:80/ws', <String, dynamic>{
    'transports': ['websocket'],
    'autoConnect': false,
    'path': '/ws/socket.io',
  });
  List messages = [];

  @override
  void dispose() {
    disconnect();
    super.dispose();
  }

  void connect() {
    socket.connect();
  }

  void disconnect() {
    socket.disconnect();
  }

  void enterRoom(String roomId) {
    socket.emit('enter_room', {'room_id': roomId});
    print("방 입장");
  }

  void leaveRoom(String roomId) {
    socket.emit('leave_room', {'room_id': roomId});
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
      setState(() {
        messages.add(data);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('SocketIO Flutter Example'),
      ),
      body: Center(
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                    onPressed: () {
                      connect();
                    },
                    child: Text("소켓연결")),
                TextButton(
                    onPressed: () {
                      enterRoom('1111');
                    },
                    child: Text("소켓방드가기")),
                TextButton(
                  onPressed: () {
                    onConnect((p0) {
                      print(p0);
                      print(socket.connected); // 연결 여부 확인
                    });
                  },
                  child: Text("소켓확인"),
                ),
                TextButton(
                    onPressed: () {
                      sendMessageToRoom("1111", "어뜨케된겨");
                    },
                    child: Text("메시지전송")),
                TextButton(
                    onPressed: () {
                      onMessage(
                        (p0) {},
                      );
                    },
                    child: Text("메시지확인")),
              ],
            ),
            Expanded(
              child: ListView.builder(
                itemCount: messages.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    title: Text(messages[index]),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
