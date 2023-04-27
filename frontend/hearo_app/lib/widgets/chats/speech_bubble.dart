import 'package:flutter/material.dart';
import 'package:bubble/bubble.dart';

class SpeechBubble extends StatefulWidget {
  final String message;
  final int who, textSize;
  const SpeechBubble({
    super.key,
    required this.message,
    required this.who,
    required this.textSize,
  });

  @override
  State<SpeechBubble> createState() => _SpeechBubbleState();
}

const colorList = {
  3: [Color.fromARGB(255, 255, 255, 255), Color.fromARGB(20, 255, 255, 255)],
  1: [Color.fromARGB(255, 255, 211, 211), Color.fromARGB(20, 255, 211, 211)],
  2: [Color.fromARGB(255, 255, 238, 211), Color.fromARGB(20, 255, 238, 211)],
  0: [Color.fromARGB(255, 254, 255, 211), Color.fromARGB(20, 254, 255, 211)],
  4: [Color.fromARGB(255, 229, 255, 211), Color.fromARGB(20, 229, 255, 211)],
  5: [Color.fromARGB(255, 152, 178, 255), Color.fromARGB(20, 152, 178, 255)],
  6: [Color.fromARGB(255, 248, 249, 255), Color.fromARGB(20, 248, 249, 255)],
  7: [Color.fromARGB(255, 243, 211, 255), Color.fromARGB(20, 243, 211, 255)],
  8: [Color.fromARGB(255, 230, 230, 230), Color.fromARGB(20, 230, 230, 230)],
  9: [Color.fromARGB(255, 186, 186, 186), Color.fromARGB(20, 186, 186, 186)],
};

// GPT 기능 더 자세하게 하면 좋을듯
class _SpeechBubbleState extends State<SpeechBubble> {
  @override
  Widget build(BuildContext context) {
    double fonts = 16;
    if (widget.textSize == 1) {
      fonts = 22;
    } else if (widget.textSize == 2) {
      fonts = 28;
    }
    return SizedBox(
      width: MediaQuery.of(context).size.width,
      child: widget.who == 0
          ? Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Bubble(
                  radius: Radius.circular(14),
                  elevation: 0.8,
                  shadowColor: colorList[widget.who]![0],
                  borderColor: colorList[widget.who]![1],
                  color: colorList[widget.who]![0],
                  margin: BubbleEdges.only(top: 5, bottom: 5),
                  alignment: Alignment.topRight,
                  nip: BubbleNip.rightTop,
                  child: Text(
                    widget.message,
                    style: TextStyle(fontSize: fonts),
                  ),
                ),
              ],
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Bubble(
                  radius: Radius.circular(14),
                  elevation: 0.8,
                  shadowColor: colorList[widget.who]![0],
                  borderColor: colorList[widget.who]![1],
                  color: colorList[widget.who]![0],
                  margin: BubbleEdges.only(top: 5, bottom: 5),
                  alignment: Alignment.topLeft,
                  nip: BubbleNip.leftTop,
                  child: Text(
                    widget.message,
                    style: TextStyle(fontSize: fonts),
                  ),
                ),
              ],
            ),
    );
  }
}
