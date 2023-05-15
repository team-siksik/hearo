import 'dart:convert';

import 'package:avatar_glow/avatar_glow.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/bluetooth_controller.dart';
import 'package:hearo_app/controller/chat_controller.dart';
import 'package:hearo_app/widgets/chats/favorite_star.dart';
import 'package:hearo_app/widgets/chats_for_glasses/custom_app_bar_chat_glasses.dart';
import 'package:hearo_app/widgets/chats_for_glasses/speech_bubble_glasses.dart';
import 'package:wakelock/wakelock.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:assets_audio_player/assets_audio_player.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart';
import 'dart:async';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class ChatHomeGlasses extends StatefulWidget {
  const ChatHomeGlasses({super.key, required this.device});
  final BluetoothDevice device;

  @override
  State<ChatHomeGlasses> createState() => _ChatHomeGlassesState();
}

class _ChatHomeGlassesState extends State<ChatHomeGlasses> {
  FlutterBluePlus flutterBlue = FlutterBluePlus.instance;

  // 연결 상태 표시 문자열
  String stateText = 'Connecting';

  // 연결 버튼 문자열
  String connectButtonText = 'Disconnect';

  // 현재 연결 상태 저장용
  BluetoothDeviceState deviceState = BluetoothDeviceState.disconnected;

  // 연결 상태 리스너 핸들 화면 종료시 리스너 해제를 위함
  StreamSubscription<BluetoothDeviceState>? _stateListener;

  BluetoothCharacteristic? characteristic;

  BluetoothController bluetoothController = Get.put(BluetoothController());

  final SpeechToText _speechToText = SpeechToText();
  bool _speechEnabled = false;
  String _lastWords = '';
  final _scrollController = ScrollController();
  List chattings = [];
  final chatController = Get.put(ChatController());
  TextEditingController textController = TextEditingController();
  final FlutterTts tts = FlutterTts();

  void addChat(chat) {
    // 새로운 항목을 ListView에 추가
    setState(() {
      chattings.add({"who": 0, "message": chat});
      chatController.changeSaying('');
    });

    // ListView를 맨 하단으로 스크롤
    _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
  }

  /// This has to happen only once per app
  void _initSpeech() async {
    _speechEnabled = await _speechToText.initialize();
    setState(() {});
  }

  /// Each time to start a speech recognition session
  void _startListening() async {
    await _speechToText.listen(
      onResult: _onSpeechResult,
      listenFor: Duration(minutes: 3),
      pauseFor: Duration(seconds: 50),
    );

    if (_lastWords.trim().isNotEmpty) {
      chattings.add({"who": 1, "message": _lastWords});
      sendMessageToGlasses(_lastWords);
      _lastWords = '';
    }

    setState(() {});
  }

  void _stopListening() async {
    await _speechToText.stop();
    setState(() {});
  }

  void _onSpeechResult(SpeechRecognitionResult result) {
    setState(() {
      _lastWords = result.recognizedWords;
    });

    if (!_speechEnabled) {
      _initSpeech();
    }

    if (_speechToText.isNotListening) {
      _startListening();
    }
  }

  @override
  void initState() {
    super.initState();
    // 화면 꺼짐 방지 활성화
    Wakelock.enable();
    // 언어 설정
    tts.setLanguage("ko-KR");
    // 속도지정 (0.0이 제일 느리고 1.0이 제일 빠름)
    tts.setSpeechRate(0.6);
    // tts.setVoice({"name": "ko-kr-x-ism-local", "locale": "ko-KR"});
    tts.setVoice({"name": "ko-kr-x-ism-network", "locale": "ko-KR"});
    // tts.setVoice({"name": "ko-kr-x-kob-network", "locale": "ko-KR"});
    _initSpeech();
    _startListening();
    // ignore: unnecessary_null_in_if_null_operators
    characteristic = bluetoothController.writeCharacteristic.value;

    if (characteristic == null) {
      connect();
    }

    _stateListener = widget.device.state.listen((event) {
      debugPrint('event :  $event');
      if (deviceState == event) {
        // 상태가 동일하다면 무시
        return;
      }
      // 연결 상태 정보 변경
      setBleConnectionState(event);
    });
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

  final AssetsAudioPlayer assetsAudioPlayer = AssetsAudioPlayer.newPlayer();

  void playAudioStop() async {
    assetsAudioPlayer.stop(); //정지
  }

  @override
  void dispose() {
    // 화면 꺼짐 방지 비활성화
    Wakelock.disable();
    _stopListening();
    // 상태 리스터 해제
    _stateListener?.cancel();
    super.dispose();
  }

  @override
  void setState(VoidCallback fn) {
    if (mounted) {
      // 화면이 mounted 되었을때만 업데이트 되게 함
      super.setState(fn);
    }
  } /* 연결 상태 갱신 */

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

  void sendMessageToGlasses(words) async {
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
    // setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    int textSize = 2;
    Size size = MediaQuery.of(context).size;
    return WillPopScope(
        onWillPop: () async {
          return false;
        },
        child: Scaffold(
          floatingActionButton: AvatarGlow(
            animate: !_speechToText.isNotListening,
            glowColor: const Color(0xffE63E43),
            endRadius: 75.0,
            duration: Duration(milliseconds: 2000),
            repeatPauseDuration: Duration(milliseconds: 100),
            repeat: true,
            child: FloatingActionButton(
              backgroundColor: _speechToText.isNotListening
                  ? Colors.black45
                  : Color(0xffe63e43),
              onPressed: _speechToText.isNotListening
                  ? _startListening
                  : _stopListening,
              tooltip: '마이크를 켜서 음성인식',
              child: Icon(
                  _speechToText.isNotListening ? Icons.mic_off : Icons.mic),
            ),
          ),
          floatingActionButtonLocation:
              FloatingActionButtonLocation.miniCenterTop,
          appBar: CustomAppBarChatGlasses(),
          body: GestureDetector(
            onTap: () {
              FocusScopeNode currentFocus = FocusScope.of(context);
              if (!currentFocus.hasPrimaryFocus) {
                currentFocus.unfocus();
              }
            },
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  height: 30,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                          } else {}
                        },
                        child: Text(connectButtonText),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Container(
                    padding: EdgeInsets.fromLTRB(2, 10, 2, 0),
                    width: size.width,
                    child: Column(
                      children: [
                        Flexible(
                          flex: 10,
                          child: Container(
                            padding: EdgeInsets.fromLTRB(15, 0, 15, 15),
                            child: ListView.separated(
                              controller: _scrollController,
                              separatorBuilder: (context, index) =>
                                  SizedBox(height: 5),
                              itemCount: chattings.length,
                              itemBuilder: (context, index) {
                                var saying = chattings[index];
                                return SpeechBubbleGlasses(
                                  textController: textController,
                                  message: saying["message"],
                                  who: saying["who"],
                                  textSize: textSize,
                                  characteristic: characteristic!,
                                );
                              },
                            ),
                          ),
                        ),
                        Container(
                          decoration: BoxDecoration(
                              border: Border(
                                  top: BorderSide(color: Colors.black38))),
                          height: size.height * 0.08,
                          width: size.width,
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              FavoriteStar(
                                  size: size, textController: textController),
                              SizedBox(
                                width: size.width * 0.75,
                                child: TextField(
                                  onTap: () {
                                    _scrollController.jumpTo(_scrollController
                                        .position.maxScrollExtent);
                                  },
                                  controller: textController,
                                  onSubmitted: (value) async {
                                    if (value.trim().isEmpty) {
                                      return;
                                    }
                                    addChat(value);
                                    setState(() {
                                      chatController.changeSaying('');
                                      textController.text = '';
                                    });
                                    _scrollController.jumpTo(_scrollController
                                        .position.maxScrollExtent);
                                  },
                                  onChanged: (text) {
                                    setState(() {
                                      chatController.changeSaying(text);
                                      _scrollController.jumpTo(_scrollController
                                          .position.maxScrollExtent);
                                    });
                                  },
                                  decoration: InputDecoration(
                                    hintText: '대화를 입력해주세요.',
                                    focusedBorder: InputBorder.none,
                                    enabledBorder: InputBorder.none,
                                  ),
                                ),
                              ),
                              IconButton(
                                  onPressed: () async {
                                    var value = chatController.inputSay;
                                    if (value.trim().isEmpty) {
                                      return;
                                    }
                                    addChat(value);
                                    await tts.speak(textController.text);
                                    setState(() {
                                      chatController.changeSaying('');
                                      textController.text = '';
                                      FocusScope.of(context).unfocus();
                                    });
                                    _scrollController.jumpTo(_scrollController
                                        .position.maxScrollExtent);
                                  },
                                  icon: Icon(Icons.send_rounded,
                                      color: Color.fromARGB(255, 97, 97, 97))),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ));
  }
}
