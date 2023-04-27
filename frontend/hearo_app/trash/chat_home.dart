import 'dart:math';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/chat_coltroller.dart';
import 'package:hearo_app/widgets/chats/custom_app_bar_chat.dart';
import 'package:hearo_app/widgets/chats/speech_bubble.dart';
import 'package:wakelock/wakelock.dart';

class ChatHome extends StatefulWidget {
  const ChatHome({super.key});

  @override
  State<ChatHome> createState() => _ChatHomeState();
}

class _ChatHomeState extends State<ChatHome> {
  final _scrollController = ScrollController();
  List chattings = [];
  final myChatController = Get.put(ChatController());
  TextEditingController textController = TextEditingController();

  void addChat(chat) {
    // 새로운 항목을 ListView에 추가합니다.

    setState(() {
      // 말풍선 확인을 위한 랜덤요소 추가
      var random = Random();
      var randomNumber = random.nextInt(4);
      chattings.add({"who": randomNumber, "message": chat});
      // chattings.add({"who": 0, "message": chat});
      myChatController.changeSaying('');
    });

    // ListView를 맨 하단으로 스크롤합니다.
    _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
  }

  @override
  void initState() {
    super.initState();
    // 화면 꺼짐 방지 활성화
    Wakelock.enable();
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
              padding: EdgeInsets.fromLTRB(20, 20, 20, 10),
              width: size.width,
              height: size.height,
              child: Stack(
                children: <Widget>[
                  Container(
                    padding: EdgeInsets.only(bottom: 130),
                    child: ListView.separated(
                      controller: _scrollController,
                      separatorBuilder: (context, index) => SizedBox(height: 5),
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
                  Positioned(
                    left: 0,
                    right: 0,
                    bottom: 0,
                    child: GestureDetector(
                      onTap: () {
                        _scrollController
                            .jumpTo(_scrollController.position.maxScrollExtent);
                      },
                      child: TextField(
                        undoController: UndoHistoryController(
                            value:
                                UndoHistoryValue(canUndo: true, canRedo: true)),
                        onTap: () {
                          _scrollController.jumpTo(
                              _scrollController.position.maxScrollExtent);
                        },
                        controller: textController,
                        onSubmitted: (value) {
                          addChat(value);
                          setState(() {
                            myChatController.changeSaying('');
                            textController.text = '';
                          });
                        },
                        onChanged: (text) {
                          setState(() {
                            myChatController.changeSaying(text);
                          });
                        },
                        decoration: InputDecoration(
                          hintText: '대화를 입력해주세요.',
                          focusedBorder: OutlineInputBorder(
                            borderRadius:
                                BorderRadius.all(Radius.circular(10.0)),
                            borderSide:
                                BorderSide(width: 1, color: Color(0xffe63e43)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius:
                                BorderRadius.all(Radius.circular(10.0)),
                            borderSide: BorderSide(
                                width: 1,
                                color:
                                    const Color.fromARGB(255, 172, 172, 172)),
                          ),
                          border: OutlineInputBorder(
                            borderRadius:
                                BorderRadius.all(Radius.circular(10.0)),
                          ),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                      right: 0,
                      bottom: 70,
                      child: GestureDetector(
                        onTap: () {},
                        child: Container(
                          width: 56,
                          height: 56,
                          decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(20),
                              color: Colors.white,
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.transparent.withOpacity(0.20),
                                  spreadRadius: 0,
                                  blurRadius: 1.0,
                                  offset: const Offset(
                                      1, 1), // changes position of shadow
                                ),
                              ]),
                          child: Icon(Icons.star_rounded,
                              color: Colors.amber, size: 32),
                        ),
                      )),
                ],
              ),
            ),
          ),
        ));
  }
}
