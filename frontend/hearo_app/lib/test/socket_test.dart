import 'package:flutter/material.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:hearo_app/skills/socket_overall.dart';
import 'package:path_provider/path_provider.dart';

class SocketTest extends StatefulWidget {
  const SocketTest({super.key});

  @override
  State<SocketTest> createState() => _SocketTestState();
}

class _SocketTestState extends State<SocketTest> {
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
                    audioSocket.onConnect((p0) {
                      print(p0);
                      print(audioSocket.socket.connected); // 연결 여부 확인
                    });
                  },
                  child: Text("소켓확인"),
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
