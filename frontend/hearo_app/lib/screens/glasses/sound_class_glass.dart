import 'dart:convert';
import 'dart:io';

import 'package:avatar_glow/avatar_glow.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/blue_test_controller.dart';
import 'dart:async';

import 'package:flutter_sound/flutter_sound.dart';
import 'package:hearo_app/screens/glasses/chat_home_glasses.dart';
import 'package:hearo_app/skills/local_noti.dart';
import 'package:hearo_app/widgets/common/custom_app_bar_inner.dart';
import 'package:path_provider/path_provider.dart';
import 'package:hearo_app/skills/socket_overall.dart';

class SoundClassGlass extends StatefulWidget {
  const SoundClassGlass({super.key});

  @override
  State<SoundClassGlass> createState() => _SoundClassGlassState();
}

class _SoundClassGlassState extends State<SoundClassGlass> {
  final SocketOverall audioSocket = SocketOverall();
  final FlutterSoundRecorder _audioRecorder = FlutterSoundRecorder();
  final FlutterSoundPlayer _audioPlayer = FlutterSoundPlayer();
  late String _recordingFilePath;

  BlueTestController bluetoothController = Get.find<BlueTestController>();

  bool _isRecording = false;
  Map info = {
    "default": "소음 인식",
    "dog_bark": "개",
    "children_playing": "어린이",
    "air_conditioner": "에어컨",
    "street_music": "음악",
    "gun_shot": "총",
    "siren": "사이렌",
    "engine_idling": "엔진",
    "jackhammer": "착암기",
    "drilling": "드릴",
    "car_horn": "자동차 경적",
    "Loading": "로딩 중",
    "Mic error": "마이크 에러",
  };
  String what = 'default';
  @override
  void initState() {
    super.initState();
    _initializeAudioRecorder();
    _initializeAudioPlayer();
    audioSocket.connect();
    audioSocket.enterRoom();
    setState(() {});
  }

  @override
  void dispose() {
    _audioRecorder.closeRecorder();
    _audioPlayer.closePlayer();
    audioSocket.closeRoom();
    audioSocket.disconnect();
    super.dispose();
  }

  Future<void> _initializeAudioRecorder() async {
    await _audioRecorder.openRecorder();
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
      audioSocket.sendClassification(fileDataB64);

      // 이전에 등록된 핸들러 제거
      audioSocket.socket.off("result");

      // 새로운 핸들러 등록
      audioSocket.socket.on("result", (data) {
        processData(data); // 데이터 처리 함수 호출
      });
    } catch (e) {
      print(e.toString());
    }
  }

  void processData(data) {
    setState(() {
      what = data;
    });
    LocalNotification.sampleNotification(
        info[what], "주위에 ${info[what]} 이/가 있습니다.");
  }

  void _recordAndSendEverySecond() async {
    _initializeAudioRecorder();
    _initializeAudioPlayer();
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
      what = 'default';
    });
  }

  void sendAlarmToGlasses(words) async {
    String data = words;
    print("@@@@@@@@@@@@@@@@@");
    List<int> bytes = utf8.encode(data);
    print("안경으로 전송");
    await bluetoothController.writeCharacteristic.value!.write(bytes);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBarInner(name: "소음 인식 Glass"),
      body: Center(
        child: Column(
          children: [
            Obx(() {
              if (bluetoothController.value.value.isEmpty) {
                if (bluetoothController.flag.value == "1") {
                  Get.to(() => ChatHomeGlasses());
                }
                return SizedBox();
              } else {
                return SizedBox();
              }
            }),
            AvatarGlow(
              animate: _isRecording,
              glowColor: const Color(0xffE63E43),
              endRadius: 75,
              duration: Duration(milliseconds: 2000),
              repeatPauseDuration: Duration(milliseconds: 100),
              repeat: true,
              child: FloatingActionButton.large(
                backgroundColor:
                    !_isRecording ? Colors.black45 : Color(0xffe63e43),
                onPressed: !_isRecording
                    ? () {
                        clearList();
                        _recordAndSendEverySecond();
                      }
                    : () {
                        _stopSendRecording();
                        setState(() {
                          what = "default";
                        });
                      },
                tooltip: '마이크를 켜서 소음 인식',
                child: !_isRecording
                    ? Icon(
                        Icons.notifications_off_outlined,
                        size: 50,
                      )
                    : Icon(
                        Icons.notifications_active_outlined,
                        size: 50,
                      ),
              ),
            ),
            information()
          ],
        ),
      ),
    );
  }

  Expanded information() {
    String txt = info[what];
    if (txt == "드릴" || txt == "착암기") {
      txt = "공사중";
    }
    return Expanded(
        child: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          Obx(() {
            if (bluetoothController.value.value.isEmpty) {
              if (bluetoothController.flag.value == "1") {
                Get.to(() => SoundClassGlass());
              }
              return SizedBox();
            } else {
              return SizedBox();
            }
          }),
          SizedBox(
              height: 250,
              width: 250,
              child: Image.asset("assets/images/$what.png")),
          Text(
            txt,
            style: TextStyle(fontSize: 32),
          ),
        ],
      ),
    ));
  }
}
