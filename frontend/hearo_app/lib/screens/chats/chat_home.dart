import 'package:avatar_glow/avatar_glow.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/chat_controller.dart';
import 'package:hearo_app/widgets/chats/custom_app_bar_chat.dart';
import 'package:hearo_app/widgets/chats/favorite_star.dart';
import 'package:hearo_app/widgets/chats/show_info.dart';
import 'package:hearo_app/widgets/chats/speech_bubble.dart';
import 'package:wakelock/wakelock.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart';

class ChatHome extends StatefulWidget {
  const ChatHome({super.key});

  @override
  State<ChatHome> createState() => _ChatHomeState();
}

class _ChatHomeState extends State<ChatHome> {
  final SpeechToText _speechToText = SpeechToText();
  final _scrollController = ScrollController();
  final chatController = Get.put(ChatController());
  final FlutterTts tts = FlutterTts();

  TextEditingController textController = TextEditingController();
  String mode = "side";
  bool _speechEnabled = false;
  String _lastWords = '';
  List chattings = [];
  List yourChattings = [];
  List myChattings = [];

  void addChat(chat) {
    // 새로운 항목을 ListView에 추가
    setState(() {
      chattings.add({"who": 0, "message": chat});
      myChattings.add(chat);
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
      listenFor: Duration(minutes: 30),
      // pauseFor: Duration(seconds: 60),
      cancelOnError: true,
      listenMode: ListenMode.deviceDefault,
    );

    await Future.delayed(Duration.zero);
    if (_speechToText.isNotListening) {
      _startListening();
    }

    if (_lastWords.trim() != "") {
      chattings.add({"who": 1, "message": _lastWords});
      yourChattings.add(_lastWords);
      await Future.delayed(Duration.zero);
      _lastWords = '';
      _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
    }

    setState(() {}); // Check if speech recognition is still ongoing

    if (!_speechEnabled) {
      _initSpeech();
    }

    await Future.delayed(Duration.zero);
    if (_speechToText.isNotListening) {
      _startListening();
    }
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
    // 들어오자마자 모달
    WidgetsBinding.instance.addPostFrameCallback((_) {
      showInfo(context);
    });
    // playAudio();
    _initSpeech();
    _startListening();
  }

  @override
  void dispose() {
    // 화면 꺼짐 방지 비활성화
    Wakelock.disable();
    _stopListening();
    super.dispose();
  }

  void changeMode() {
    setState(() {
      if (mode == "side") {
        mode = "face";
      } else {
        mode = "side";
      }
    });
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
            animate: _speechToText.isListening,
            glowColor: Color.fromARGB(130, 230, 62, 68),
            endRadius: 75.0,
            duration: Duration(milliseconds: 2000),
            repeatPauseDuration: Duration(milliseconds: 100),
            repeat: true,
            child: FloatingActionButton(
              backgroundColor: _speechToText.isNotListening
                  ? const Color.fromARGB(49, 0, 0, 0)
                  : Color.fromARGB(130, 230, 62, 68),
              onPressed: _speechToText.isNotListening
                  ? _startListening
                  : _stopListening,
              tooltip: '마이크를 켜서 음성인식',
              child: Icon(
                  _speechToText.isNotListening ? Icons.mic_off : Icons.mic),
            ),
          ),
          floatingActionButtonLocation: mode == "side"
              ? FloatingActionButtonLocation.miniCenterTop
              : FloatingActionButtonLocation.miniCenterTop,
          appBar: CustomAppBarChat(),
          body: GestureDetector(
            onTap: () {
              FocusScopeNode currentFocus = FocusScope.of(context);
              if (!currentFocus.hasPrimaryFocus) {
                currentFocus.unfocus();
              }
            },
            child: Container(
              padding: EdgeInsets.fromLTRB(2, 10, 2, 0),
              width: size.width,
              height: size.height,
              child: Column(
                children: [
                  mode == "side"
                      ? Flexible(
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
                                return SpeechBubble(
                                    textController: textController,
                                    message: saying["message"],
                                    who: saying["who"],
                                    textSize: textSize);
                              },
                            ),
                          ),
                        )
                      : Flexible(
                          flex: 10,
                          child: Column(
                            children: [
                              Flexible(
                                flex: 5,
                                child: Transform(
                                  transform:
                                      Matrix4.diagonal3Values(-1.0, -1.0, 1.0),
                                  alignment: Alignment.center,
                                  child: Container(
                                    padding: EdgeInsets.fromLTRB(15, 10, 15, 0),
                                    child: ListView.separated(
                                      controller: _scrollController,
                                      separatorBuilder: (context, index) =>
                                          SizedBox(height: 5),
                                      itemCount: myChattings.length,
                                      itemBuilder: (context, index) {
                                        var saying = myChattings[index];
                                        return SpeechBubble(
                                          textController: textController,
                                          message: saying,
                                          who: 0,
                                          textSize: textSize,
                                        );
                                      },
                                    ),
                                  ),
                                ),
                              ),
                              Flexible(
                                flex: 5,
                                child: Container(
                                  padding: EdgeInsets.fromLTRB(15, 10, 15, 0),
                                  child: ListView.separated(
                                    controller: _scrollController,
                                    separatorBuilder: (context, index) =>
                                        SizedBox(height: 5),
                                    itemCount: yourChattings.length,
                                    itemBuilder: (context, index) {
                                      var saying = yourChattings[index];
                                      return SpeechBubble(
                                        textController: textController,
                                        message: saying,
                                        who: 1,
                                        textSize: textSize,
                                      );
                                    },
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                  Container(
                    decoration: BoxDecoration(
                        border: Border(top: BorderSide(color: Colors.black38))),
                    height: size.height * 0.08,
                    width: size.width,
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        IconButton(
                            onPressed: () {
                              changeMode();
                            },
                            icon: Icon(Icons.change_circle_outlined)),
                        FavoriteStar(
                            size: size, textController: textController),
                        SizedBox(
                          width: size.width * 0.64,
                          child: TextField(
                            onTap: () {
                              _scrollController.jumpTo(
                                  _scrollController.position.maxScrollExtent);
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
                              _scrollController.jumpTo(
                                  _scrollController.position.maxScrollExtent);
                            },
                            onChanged: (text) {
                              setState(() {
                                chatController.changeSaying(text);
                                _scrollController.jumpTo(
                                    _scrollController.position.maxScrollExtent);
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
                                if (_speechToText.isNotListening) {
                                  _startListening();
                                } else {
                                  _stopListening();
                                }
                                return;
                              }
                              if (_speechToText.isListening) {
                                _speechToText.stop();
                              }
                              addChat(value);
                              await tts.speak(textController.text);
                              setState(() {
                                chatController.changeSaying('');
                                textController.text = '';
                                FocusScope.of(context).unfocus();
                              });
                              _scrollController.jumpTo(
                                  _scrollController.position.maxScrollExtent);
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
        ));
  }
}
