import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:path_provider/path_provider.dart';
import 'package:hearo_app/skills/socket_overall.dart';

class SoundClass extends StatefulWidget {
  const SoundClass({super.key});

  @override
  State<SoundClass> createState() => _SoundClassState();
}

class _SoundClassState extends State<SoundClass> {
  final SocketOverall audioSocket = SocketOverall();
  final FlutterSoundRecorder _audioRecorder = FlutterSoundRecorder();
  final FlutterSoundPlayer _audioPlayer = FlutterSoundPlayer();
  late String _recordingFilePath;
  bool _isRecording = false;
  List temp = [];
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
    // _audioRecorder.setSubscriptionDuration(Duration(milliseconds: 100));
  }

  Future<void> _initializeAudioPlayer() async {
    await _audioPlayer.openPlayer();
  }

  Future<void> _startRecording() async {
    try {
      setState(() {
        _isRecording = true;
      });
      final tempDir = await getTemporaryDirectory();
      final recordingFileName =
          'recording_${DateTime.now().microsecondsSinceEpoch}.wav';
      final recordingFilePath = '${tempDir.path}/$recordingFileName';
      await _audioRecorder.startRecorder(
          toFile: recordingFilePath, codec: Codec.pcm16WAV);

      setState(() {
        _recordingFilePath = recordingFilePath;
      });
    } catch (e) {
      print(e.toString());
    }
  }

  Future<void> _stopRecording() async {
    try {
      _audioRecorder.stopRecorder();
      File file = File(_recordingFilePath);
      List<int> fileData = file.readAsBytesSync();
      String fileDataB64 = base64Encode(fileData);
      audioSocket.sendClassification('1111', fileDataB64);
      print(
          "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      String datum = audioSocket.getClassification(); // 비동기로 데이터 받기

      temp.add(datum);
    } catch (e) {
      print(e.toString());
    }
  }

  void _recordAndSendEverySecond() async {
    setState(() {
      _isRecording = true;
    });

    while (_isRecording) {
      _startRecording();
      await Future.delayed(Duration(milliseconds: 1000));
      _stopRecording();
    }
  }

  void _stopSendRecording() async {
    setState(() {
      _isRecording = false;
    });
    await _audioRecorder.stopRecorder();
    await _audioRecorder.closeRecorder();
  }

  void clearList() async {
    setState(() {
      temp = [];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('소음 인식'),
      ),
      body: Center(
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                IconButton(
                  onPressed: () async {
                    clearList();
                    _recordAndSendEverySecond();
                  },
                  icon: Icon(Icons.mic),
                ),
                SizedBox(width: 10),
                IconButton(
                  onPressed: _stopSendRecording,
                  icon: Icon(Icons.stop),
                ),
                SizedBox(width: 10),
                IconButton(
                  onPressed: () {
                    print(temp);
                    clearList();
                  },
                  icon: Icon(Icons.text_increase_rounded),
                ),
              ],
            ),
            Expanded(
                child: ListView.separated(
                    reverse: true,
                    itemBuilder: (context, index) {
                      var txt = temp[index];
                      return Text(txt);
                    },
                    separatorBuilder: (context, index) => SizedBox(
                          height: 5,
                        ),
                    itemCount: temp.length))
          ],
        ),
      ),
    );
  }
}
