import 'package:flutter/material.dart';

Future showInfoDetail(context) async {
  return showDialog(
    context: context,
    builder: (BuildContext context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.sentiment_satisfied_alt_rounded,
                color: Color.fromARGB(255, 158, 244, 37)),
            Text(
              '대화 이용하기',
              textAlign: TextAlign.center,
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: SizedBox(
          height: 300,
          width: 300,
          child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Icon(Icons.warning_amber_rounded,
                        color: Color(0xff3ED598), size: 30),
                    Text(
                      "대화 유의사항 보기",
                      style: TextStyle(fontSize: 18),
                    ),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Icon(Icons.live_help_outlined,
                        color: Color.fromARGB(255, 62, 113, 243), size: 30),
                    Text(
                      "대화 이용 설명 보기",
                      style: TextStyle(fontSize: 18),
                    ),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Icon(Icons.mic_off_rounded,
                        color: Color.fromARGB(255, 0, 0, 0), size: 30),
                    Text(
                      "STT 시작 하기",
                      style: TextStyle(fontSize: 18),
                    ),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Icon(Icons.mic,
                        color: Color.fromARGB(255, 255, 0, 0), size: 30),
                    Text(
                      "STT 사용 중",
                      style: TextStyle(fontSize: 18),
                    ),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "대화 종료",
                      style: TextStyle(color: Color.fromARGB(255, 230, 17, 17)),
                    ),
                    Text(
                      "대화 종료 하기",
                      style: TextStyle(fontSize: 18),
                    ),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Icon(Icons.change_circle_outlined,
                        color: Color.fromARGB(255, 91, 91, 91), size: 30),
                    Text(
                      "대화 방향 전환",
                      style: TextStyle(fontSize: 18),
                    ),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Icon(Icons.star_rate_rounded,
                        color: Color.fromARGB(255, 250, 226, 15), size: 30),
                    Text(
                      "자주 쓰는 말 보기",
                      style: TextStyle(fontSize: 18),
                    ),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Icon(Icons.chat_bubble,
                        color: Color.fromARGB(162, 254, 79, 126), size: 30),
                    Text(
                      "길게 눌러 답변 추천",
                      style: TextStyle(fontSize: 18),
                    ),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Icon(Icons.chat_bubble,
                        color: Color.fromARGB(214, 237, 231, 56), size: 30),
                    Text(
                      "짧게 눌러 음성으로 읽기",
                      style: TextStyle(fontSize: 18),
                    ),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Icon(Icons.chat_bubble,
                        color: Color.fromARGB(214, 237, 231, 56), size: 30),
                    Text(
                      "길게 눌러 자주 쓰는 말로 저장하기",
                      style: TextStyle(fontSize: 18),
                    ),
                  ],
                ),
              ]),
        )),
  );
}
