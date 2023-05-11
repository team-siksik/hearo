import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:hearo_app/skills/socket_overall.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

class SocketTest extends StatefulWidget {
  const SocketTest({super.key});

  @override
  State<SocketTest> createState() => _SocketTestState();
}

class _SocketTestState extends State<SocketTest> {
  Future<String> pngToBase64(String imageName) async {
    ByteData imageBytes = await rootBundle.load('assets/images/$imageName.png');
    List<int> bytes = imageBytes.buffer.asUint8List();
    String base64Image = base64Encode(bytes);
    print(base64Image.length);
    print("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    return base64Image;
  }

  Future<void> someFunction() async {
    String imageName = 'test';
    String img64 = await pngToBase64(imageName);
    print("@@");
    audioSocket.sendVideo('1111', img64);
  }

  final SocketOverall audioSocket = SocketOverall();
  List messages = [];
  final FlutterSoundRecorder _audioRecorder = FlutterSoundRecorder();
  final FlutterSoundPlayer _audioPlayer = FlutterSoundPlayer();
  late String _recordingFilePath;
  @override
  void initState() {
    super.initState();
    _initializeAudioRecorder();
    _initializeAudioPlayer();
    audioSocket.connect();
    audioSocket.enterRoom("1111");
    setState(() {});
  }

  @override
  void dispose() {
    audioSocket.closeRoom("1111");
    audioSocket.disconnect();
    _audioRecorder.closeRecorder();
    _audioPlayer.closePlayer();
    super.dispose();
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('음성소켓 연습'),
      ),
      body: Center(
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                    onPressed: () {
                      audioSocket.connect();
                    },
                    child: Text("소켓연결")),
                TextButton(
                    onPressed: () {
                      audioSocket.enterRoom('1111');
                    },
                    child: Text("소켓방드가기")),
                TextButton(
                  onPressed: () {
                    someFunction();
                  },
                  child: Text("이미지전송"),
                ),
                TextButton(
                    onPressed: () {
                      audioSocket.sendMessageToRoom("1111", "어뜨케된겨");
                    },
                    child: Text("메시지전송")),
                TextButton(
                    onPressed: () {
                      audioSocket.onMessage(
                        (p0) {},
                      );
                    },
                    child: Text("메시지확인")),
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
          ],
        ),
      ),
    );
  }
}
