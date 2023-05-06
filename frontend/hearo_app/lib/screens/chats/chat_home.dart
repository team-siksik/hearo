import 'dart:math';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/chat_controller.dart';
import 'package:hearo_app/widgets/chats/custom_app_bar_chat.dart';
import 'package:hearo_app/widgets/chats/favorite_star.dart';
import 'package:hearo_app/widgets/chats/show_info_first.dart';
import 'package:hearo_app/widgets/chats/speech_bubble.dart';
import 'package:wakelock/wakelock.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:assets_audio_player/assets_audio_player.dart';

class ChatHome extends StatefulWidget {
  const ChatHome({super.key});

  @override
  State<ChatHome> createState() => _ChatHomeState();
}

class _ChatHomeState extends State<ChatHome> {
  final _scrollController = ScrollController();
  List chattings = [];
  final chatController = Get.put(ChatController());
  TextEditingController textController = TextEditingController();
  final FlutterTts tts = FlutterTts();
  void addChat(chat) {
    // 새로운 항목을 ListView에 추가
    setState(() {
      // 말풍선 확인을 위한 랜덤요소 추가
      var random = Random();
      var randomNumber = random.nextInt(2);
      chattings.add({"who": randomNumber, "message": chat});
      // chattings.add({"who": 0, "message": chat});
      chatController.changeSaying('');
    });

    // ListView를 맨 하단으로 스크롤
    _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
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
      showInfoFirst(context);
    });
    playAudio();
    Future.delayed(Duration(milliseconds: 3300), () async {
      playAudioStop();
      Get.back();
    });
  }

  final AssetsAudioPlayer assetsAudioPlayer = AssetsAudioPlayer.newPlayer();
  void playAudio() async {
    await assetsAudioPlayer.open(
      Audio("assets/audios/hearo_start.wav"),
      loopMode: LoopMode.none, //반복 여부 (LoopMode.none : 없음)
      autoStart: false, //자동 시작 여부
      showNotification: false, //스마트폰 알림 창에 띄울지 여부
    );

    assetsAudioPlayer.play(); //재생
    // assetsAudioPlayer.pause(); //멈춤
    // assetsAudioPlayer.stop(); //정지
  }

  void playAudioStop() async {
    assetsAudioPlayer.stop(); //정지
  }

  @override
  void dispose() {
    // 화면 꺼짐 방지 비활성화
    Wakelock.disable();
    super.dispose();
  }

  AudioPlayer player = AudioPlayer();
  Future playSound() async {
    await player.play(DeviceFileSource("assets/audios/hearo_start.wav"));
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
                          return SpeechBubble(
                              textController: textController,
                              message: saying["message"],
                              who: saying["who"],
                              textSize: textSize);
                        },
                      ),
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
                        FavoriteStar(
                            size: size, textController: textController),
                        SizedBox(
                          width: size.width * 0.75,
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
                                return;
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
