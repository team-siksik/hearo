import 'dart:convert';
import 'dart:io';

import 'package:avatar_glow/avatar_glow.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/bluetooth_controller.dart';
import 'dart:async';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';

import 'package:flutter_sound/flutter_sound.dart';
import 'package:hearo_app/skills/local_noti.dart';
import 'package:hearo_app/widgets/common/custom_app_bar_inner.dart';
import 'package:path_provider/path_provider.dart';
import 'package:hearo_app/skills/socket_overall.dart';

class SoundClassGlass extends StatefulWidget {
  const SoundClassGlass({super.key, required this.device});
  final BluetoothDevice device;
  @override
  State<SoundClassGlass> createState() => _SoundClassGlassState();
}

class _SoundClassGlassState extends State<SoundClassGlass> {
  final SocketOverall audioSocket = SocketOverall();
  final FlutterSoundRecorder _audioRecorder = FlutterSoundRecorder();
  final FlutterSoundPlayer _audioPlayer = FlutterSoundPlayer();
  late String _recordingFilePath;
  FlutterBluePlus flutterBlue = FlutterBluePlus.instance;

  // 연결 상태 표시 문자열
  String stateText = 'Connecting';

  // 연결 버튼 문자열
  String connectButtonText = 'Disconnect';

  // 현재 연결 상태 저장용
  BluetoothDeviceState deviceState = BluetoothDeviceState.disconnected;

  // 연결 상태 리스너 핸들 화면 종료시 리스너 해제를 위함
  StreamSubscription<BluetoothDeviceState>? stateListener;

  BluetoothCharacteristic? characteristic;

  BluetoothController bluetoothController = Get.put(BluetoothController());

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
    characteristic = bluetoothController.writeCharacteristic.value;

    if (characteristic == null) {
      connect();
    }

    stateListener = widget.device.state.listen((event) {
      debugPrint('event :  $event');
      if (deviceState == event) {
        // 상태가 동일하다면 무시
        return;
      }
      // 연결 상태 정보 변경
      setBleConnectionState(event);
    });
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

/* 연결 시작 */
  Future<bool> connect() async {
    Future<bool>? returnValue;
    setState(() {
      /* 상태 표시를 Connecting으로 변경 */
      stateText = 'H-Glass 연결 중';
    });

    /* 
    타임아웃을 10초(10000ms)로 설정 및 autoconnect 해제
     참고로 autoconnect가 true되어있으면 연결이 지연되는 경우가 있음.
   */
    await widget.device
        .connect(autoConnect: false)
        .timeout(Duration(milliseconds: 4000), onTimeout: () {
      //타임아웃 발생
      //returnValue를 false로 설정
      returnValue = Future.value(false);
      debugPrint('timeout failed');

      //연결 상태 disconnected로 변경
      setBleConnectionState(BluetoothDeviceState.disconnected);
    }).then((data) async {
      if (returnValue == null) {
        //returnValue가 null이면 timeout이 발생한 것이 아니므로 연결 성공
        debugPrint('connection successful');
        returnValue = Future.value(true);

        //서비스와 캐릭터리스틱 찾기
        List<BluetoothService> services =
            await widget.device.discoverServices();
        for (var service in services) {
          var characteristics = service.characteristics;
          for (BluetoothCharacteristic c in characteristics) {
            if (c.uuid.toString() == "0000ffe2-0000-1000-8000-00805f9b34fb") {
              print(c.uuid.toString());
              print("성공");
              characteristic = c;
              bluetoothController.setWriteChar(c);
              print(c);
              print(bluetoothController.writeCharacteristic);
              break;
            } else {
              print(c);
              print("실패");
            }
          }
        }
      }
    });
    print(widget.device);
    print(characteristic);
    return returnValue ?? Future.value(false);
  }

  setBleConnectionState(BluetoothDeviceState event) {
    switch (event) {
      case BluetoothDeviceState.disconnected:
        stateText = 'H-Glass 연결 끊김';
        // 버튼 상태 변경
        connectButtonText = '다시연결하기';
        break;
      case BluetoothDeviceState.disconnecting:
        stateText = 'H-Glass 끊는 중';
        break;
      case BluetoothDeviceState.connected:
        stateText = 'H-Glass 연결 됨';
        // 버튼 상태 변경
        connectButtonText = '연결끊기';
        break;
      case BluetoothDeviceState.connecting:
        stateText = 'H-Glass 연결 중';
        break;
    }
    //이전 상태 이벤트 저장
    deviceState = event;
    setState(() {});
  }

  /* 연결 해제 */
  void disconnect() {
    try {
      setState(() {
        stateText = 'H-Glass 연결 끊는 중';
      });
      widget.device.disconnect();
    } catch (e) {
      print(e);
    }
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
    if (characteristic == null) {
      connect();
      return;
    }
    String data = words;
    print("@@@@@@@@@@@@@@@@@");
    print(data);
    List<int> bytes = utf8.encode(data);
    // print(characteristic);
    print("안경으로 전송");
    await characteristic!.write(bytes);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBarInner(name: "소음 인식 Glass"),
      body: Center(
        child: Column(
          children: [
            SizedBox(
              height: 30,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Text(stateText),
                  /* 연결 및 해제 버튼 */
                  OutlinedButton(
                    onPressed: () {
                      if (deviceState == BluetoothDeviceState.connected) {
                        /* 연결된 상태라면 연결 해제 */
                        disconnect();
                      } else if (deviceState ==
                          BluetoothDeviceState.disconnected) {
                        /* 연결 해재된 상태라면 연결 */
                        connect();
                      } else {}
                    },
                    child: Text(connectButtonText),
                  ),
                ],
              ),
            ),
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
