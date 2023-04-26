import 'package:flutter/material.dart';
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

  void addChat() {
    // 새로운 항목을 ListView에 추가합니다.
    setState(() {
      conversations.add({"who": 1, "message": "회의를 시작하겠습니다."});
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

  List conversations = [
    {"who": 1, "message": "회의를 시작하겠습니다회의를 시작하겠습니다회의를 시작하겠습니다."},
    {"who": 2, "message": "안녕하세요."},
    {"who": 0, "message": "반갑습니다!"},
    {"who": 4, "message": "좋은 하루에요!"},
    {"who": 5, "message": "봄바람 휘날리며~"},
    {"who": 3, "message": "이 회의를 끝내러 왔다."},
    {"who": 1, "message": "회의를 시작하겠습니다."},
    {"who": 2, "message": "안녕하세요."},
    {"who": 0, "message": "반갑습니다!"},
    {"who": 4, "message": "좋은 하루에요!"},
    {"who": 5, "message": "봄바람 휘날리며~"},
    {"who": 3, "message": "이 회의를 끝내러 왔다."},
    {"who": 1, "message": "회의를 시작하겠습니다."},
    {"who": 2, "message": "안녕하세요."},
    {"who": 0, "message": "반갑습니다!"},
    {"who": 4, "message": "좋은 하루에요!"},
    {"who": 5, "message": "봄바람 휘날리며~"},
    {"who": 3, "message": "이 회의를 끝내러 왔다."},
  ];

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
                    padding: EdgeInsets.only(bottom: 70),
                    child: ListView.separated(
                      controller: _scrollController,
                      separatorBuilder: (context, index) => SizedBox(height: 5),
                      itemCount: conversations.length,
                      itemBuilder: (context, index) {
                        var saying = conversations[index];
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
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: '대화를 입력해주세요.',
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10.0)),
                          borderSide:
                              BorderSide(width: 1, color: Color(0xffe63e43)),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10.0)),
                          borderSide: BorderSide(
                              width: 1,
                              color: const Color.fromARGB(255, 172, 172, 172)),
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10.0)),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                      right: 0,
                      bottom: 65,
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
