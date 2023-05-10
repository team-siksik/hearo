import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as so_io;
import 'package:flutter_sound/flutter_sound.dart';
import 'package:path_provider/path_provider.dart';
import 'package:camera/camera.dart';

class SocketTest extends StatefulWidget {
  const SocketTest({super.key});

  @override
  State<SocketTest> createState() => _SocketTestState();
}

class _SocketTestState extends State<SocketTest> {
  final so_io.Socket socket =
      so_io.io('http://k8a6031.p.ssafy.io:80/', <String, dynamic>{
    'transports': ['websocket'],
    'autoConnect': true,
    'path': '/ws/socket.io',
  });
  List messages = [];
  final FlutterSoundRecorder _audioRecorder = FlutterSoundRecorder();
  final FlutterSoundPlayer _audioPlayer = FlutterSoundPlayer();
  late String _recordingFilePath;
  late List _cameras;
  late CameraController controller;

  Future<void> runCamera() async {
    _cameras = await availableCameras();
  }

  @override
  void initState() {
    super.initState();
    initializeCamera();
    _initializeAudioRecorder();
    _initializeAudioPlayer();
    enterRoom("1111");
    setState(() {});
  }

  @override
  void dispose() {
    closeRoom("1111");
    disconnect();
    _audioRecorder.closeRecorder();
    _audioPlayer.closePlayer();
    controller.dispose();
    super.dispose();
  }

  Future<void> initializeCamera() async {
    _cameras = await availableCameras();
    setState(() {
      controller = CameraController(_cameras[0], ResolutionPreset.medium);
      controller.initialize();
    });
  }

  Future<void> _initializeAudioRecorder() async {
    await _audioRecorder.openRecorder();
    _audioRecorder.setSubscriptionDuration(Duration(milliseconds: 10));
  }

  Future<void> _initializeAudioPlayer() async {
    await _audioPlayer.openPlayer();
  }

  Future<void> _startRecording() async {
    try {
      final tempDir = await getTemporaryDirectory();
      final recordingFileName =
          'recording_${DateTime.now().microsecondsSinceEpoch}.wav';
      final recordingFilePath = '${tempDir.path}/$recordingFileName';
      await _audioRecorder.startRecorder(toFile: recordingFilePath);
      setState(() {
        _recordingFilePath = recordingFilePath;
      });
    } catch (e) {
      print(e.toString());
    }
  }

  Future<void> _stopRecording() async {
    try {
      await _audioRecorder.stopRecorder();
    } catch (e) {
      print(e.toString());
    }
  }

  Future<void> _playRecording() async {
    try {
      await _audioPlayer.startPlayer(fromURI: _recordingFilePath);
    } catch (e) {
      print(e.toString());
    }
  }

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
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                    onPressed: () {
                      closeRoom('1111');
                    },
                    child: Text("소켓방나가기")),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                IconButton(
                  onPressed: _startRecording,
                  icon: Icon(Icons.mic),
                ),
                SizedBox(width: 10),
                IconButton(
                  onPressed: _stopRecording,
                  icon: Icon(Icons.stop),
                ),
                SizedBox(width: 10),
                IconButton(
                  onPressed: _playRecording,
                  icon: Icon(Icons.play_arrow),
                ),
              ],
            ),
            Expanded(child: CameraPreview(controller)),
          ],
        ),
      ),
    );
  }
}
