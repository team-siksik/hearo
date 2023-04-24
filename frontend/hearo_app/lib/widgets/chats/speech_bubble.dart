import 'package:flutter/material.dart';

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
  0: Color.fromARGB(90, 152, 178, 255),
  1: Color.fromARGB(90, 255, 211, 211),
  2: Color.fromARGB(90, 255, 238, 211),
  3: Color.fromARGB(90, 254, 255, 211),
  4: Color.fromARGB(90, 229, 255, 211),
  5: Color.fromARGB(90, 211, 255, 246),
  6: Color.fromARGB(90, 248, 249, 255),
  7: Color.fromARGB(90, 243, 211, 255),
  8: Color.fromARGB(90, 230, 230, 230),
  9: Color.fromARGB(90, 186, 186, 186),
};

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
                Container(
                  decoration: BoxDecoration(
                    // border: Border.all(color: Colors.black26, width: 0.3),
                    borderRadius: BorderRadius.circular(14),
                    color: colorList[widget.who],
                  ),
                  padding: EdgeInsets.symmetric(vertical: 5, horizontal: 10),
                  margin: EdgeInsets.only(bottom: 10),
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
                Container(
                  decoration: BoxDecoration(
                    // border: Border.all(color: Colors.black26, width: 0.3),
                    borderRadius: BorderRadius.circular(14),
                    color: colorList[widget.who],
                  ),
                  padding: EdgeInsets.symmetric(vertical: 5, horizontal: 10),
                  margin: EdgeInsets.only(bottom: 10),
                  child: Text(
                      textAlign: TextAlign.left,
                      widget.message,
                      style: TextStyle(fontSize: fonts)),
                ),
              ],
            ),
    );
  }
}
