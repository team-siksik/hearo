import 'dart:math';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/chat_coltroller.dart';
import 'package:hearo_app/widgets/chats/custom_app_bar_chat.dart';
import 'package:hearo_app/widgets/chats/favorite_star.dart';
import 'package:hearo_app/widgets/chats/speech_bubble.dart';
import 'package:wakelock/wakelock.dart';
import 'package:flutter_tts/flutter_tts.dart';

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
      var randomNumber = random.nextInt(4);
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
  }

  @override
  void dispose() {
    // 화면 꺼짐 방지 비활성화
    Wakelock.disable();
    super.dispose();
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
                            onSubmitted: (value) {
                              if (value.trim().isEmpty) {
                                return;
                              }
                              addChat(value);
                              setState(() {
                                chatController.changeSaying('');
                                textController.text = '';
                                _scrollController.jumpTo(
                                    _scrollController.position.maxScrollExtent);
                              });
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
                            onPressed: () {
                              var value = chatController.inputSay;
                              if (value.trim().isEmpty) {
                                return;
                              }
                              addChat(value);
                              setState(() {
                                chatController.changeSaying('');
                                tts.speak(textController.text);
                                textController.text = '';
                                _scrollController.jumpTo(
                                    _scrollController.position.maxScrollExtent);
                              });
                              FocusScope.of(context).unfocus();
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
