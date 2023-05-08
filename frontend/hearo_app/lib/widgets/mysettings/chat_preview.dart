import 'package:flutter/material.dart';
import 'package:hearo_app/widgets/chats/speech_bubble.dart';

class ChatPreview extends StatelessWidget {
  final Size size;
  // 투두: 나중에는 개인정보에서 textSize를 가져와야함
  final int textSize;
  final TextEditingController textController;
  const ChatPreview(
      {super.key,
      required this.size,
      required this.textSize,
      required this.textController});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size.width,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text("대화창 미리보기",
                style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                    color: Colors.black54)),
          ),
          SizedBox(
            width: size.width,
            height: size.height * 0.222,
            child: ListView(
              children: [
                SpeechBubble(
                    textController: textController,
                    textSize: textSize,
                    message: "회의를 시작하겠습니다.",
                    who: 1),
                SpeechBubble(
                    textController: textController,
                    textSize: textSize,
                    message: "좋은 아침이에요.",
                    who: 3),
                SpeechBubble(
                    textController: textController,
                    textSize: textSize,
                    message: "안녕하세요!!",
                    who: 0),
                SpeechBubble(
                    textController: textController,
                    textSize: textSize,
                    message: "안녕하세요~~!!",
                    who: 4),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
