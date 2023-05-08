import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as so_io;

class SocketTest extends StatefulWidget {
  const SocketTest({super.key});

  @override
  State<SocketTest> createState() => _SocketTestState();
}

class _SocketTestState extends State<SocketTest> {
  late so_io.Socket socket;

  @override
  void initState() {
    super.initState();

    // Connect to the server
    socket = so_io.io('http://k8a6031.p.ssafy.io:80/ws', <String, dynamic>{
      'transports': ['polling'],
      'autoConnect': false,
      'path': '/ws/socket.io',
    });
    socket.connect();
    socket.onConnect((_) {
      print('connect');
      socket.emit('msg', 'test');
    });
    socket.on('event', (data) => print(data));
    socket.onDisconnect((_) => print('disconnect'));
    socket.on('fromServer', (_) => print(_));
  }

  @override
  void dispose() {
    socket.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('SocketIO Flutter Example'),
      ),
      body: Center(
        child: Text('SocketIO Flutter Example'),
      ),
    );
  }
}
