import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:bubble/bubble.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:get/get.dart';
import 'package:hearo_app/test/gpt_api.dart';
import 'package:hearo_app/apis/say_api.dart';
import 'package:hearo_app/controller/chat_controller.dart';

enum TtsState { playing, stopped, paused, continued }

class SpeechBubble extends StatefulWidget {
  final String message;
  final int who, textSize;
  final TextEditingController textController;
  const SpeechBubble(
      {super.key,
      required this.message,
      required this.who,
      required this.textSize,
      required this.textController});

  @override
  State<SpeechBubble> createState() => _SpeechBubbleState();
}

const colorList = {
  0: [Color.fromARGB(255, 254, 255, 211), Color.fromARGB(20, 254, 255, 211)],
  1: [Color.fromARGB(255, 255, 211, 211), Color.fromARGB(20, 255, 211, 211)],
  2: [Color.fromARGB(255, 255, 238, 211), Color.fromARGB(20, 255, 238, 211)],
  3: [Color.fromARGB(255, 213, 161, 255), Color.fromARGB(20, 255, 255, 255)],
  4: [Color.fromARGB(255, 229, 255, 211), Color.fromARGB(20, 229, 255, 211)],
  5: [Color.fromARGB(255, 152, 178, 255), Color.fromARGB(20, 152, 178, 255)],
  6: [Color.fromARGB(255, 248, 249, 255), Color.fromARGB(20, 248, 249, 255)],
  7: [Color.fromARGB(255, 243, 211, 255), Color.fromARGB(20, 243, 211, 255)],
  8: [Color.fromARGB(255, 230, 230, 230), Color.fromARGB(20, 230, 230, 230)],
  9: [Color.fromARGB(255, 186, 186, 186), Color.fromARGB(20, 186, 186, 186)],
};

class _SpeechBubbleState extends State<SpeechBubble> {
// GPT 기능 더 자세하게 하면 좋을듯
  Future getSentence(context, size, text) async {
    List sentences = await ApiGpt.sayCreateApi(text);
    return showDialog(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: Text(
          "추천 답변",
          textAlign: TextAlign.center,
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(25))),
        content: SizedBox(
          height: size.width * 0.8,
          width: size.width * 0.8,
          child: ListView.separated(
            separatorBuilder: (context, index) => SizedBox(
              height: size.height * 0.017,
            ),
            itemCount: sentences.length,
            itemBuilder: (context, index) {
              return recommendSay(context, size, sentences[index]);
            },
          ),
        ),
      ),
    );
  }

  late FlutterTts tts;
  late TtsState ttsState;
  List favorite = [];
  List favoriteSentences = [];
  @override
  void initState() {
    super.initState();
    loadfavorites();
    tts = FlutterTts();
    // 언어 설정
    tts.setLanguage("ko-KR");
    // 속도지정 (0.0이 제일 느리고 1.0이 제일 빠름)
    tts.setSpeechRate(0.6);
    // tts.setVoice({"name": "ko-kr-x-ism-local", "locale": "ko-KR"});
    tts.setVoice({"name": "ko-kr-x-ism-network", "locale": "ko-KR"});
    // tts.setVoice({"name": "ko-kr-x-kob-network", "locale": "ko-KR"});
    ttsState = TtsState.stopped; // 초기화 추가
    tts.setLanguage("ko-KR");
    tts.setSpeechRate(0.6);
    tts.setVoice({"name": "ko-kr-x-ism-network", "locale": "ko-KR"});
    tts.setStartHandler(() {
      setState(() {
        ttsState = TtsState.playing;
      });
    });
    tts.setCompletionHandler(() {
      setState(() {
        ttsState = TtsState.stopped;
      });
    });
    tts.setErrorHandler((err) {
      setState(() {
        ttsState = TtsState.stopped;
      });
    });
  }

  Future<void> loadfavorites() async {
    final favorites = await ApiSay.sayGetApi();
    setState(() {
      favorite = favorites;
      for (var item in favorites) {
        favoriteSentences.add(item["sentence"]);
      }
    });
  }

  Future<void> createfavorite(saying) async {
    await ApiSay.sayCreateApi(saying);
    final favorites = await ApiSay.sayGetApi();
    setState(() {
      favorite = favorites;
      favoriteSentences = [];
      for (var item in favorites) {
        favoriteSentences.add(item["sentence"]);
      }
    });
  }

  void onTtsState(TtsState state) {
    setState(() {
      ttsState = state;
    });
  }

  @override
  Widget build(BuildContext context) {
    double fonts = 16;
    if (widget.textSize == 1) {
      fonts = 22;
    } else if (widget.textSize == 2) {
      fonts = 28;
    }
    Size size = MediaQuery.of(context).size;
    return SizedBox(
      width: size.width,
      child: widget.who == 0
          ? Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                GestureDetector(
                  onTap: () async {
                    if (ttsState != TtsState.playing) {
                      onTtsState(TtsState.playing);
                      await tts.speak(widget.message);
                      onTtsState(TtsState.stopped);
                    }
                  },
                  onLongPress: () =>
                      sayingDialog(context, size, widget.message),
                  child: Bubble(
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
                ),
              ],
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                GestureDetector(
                  onLongPress: () {
                    getSentence(context, size, widget.message);
                  },
                  child: Bubble(
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
                ),
              ],
            ),
    );
  }

  Future<dynamic> sayingDialog(BuildContext context, Size size, String say) {
    return showDialog(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          '자주 쓰는 말로 추가',
          textAlign: TextAlign.center,
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        content: SizedBox(
            width: size.width * 0.55,
            child: Text("$say 을/를 자주쓰는 말에 추가하시겠습니까?")),
        actions: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton(
                style: ButtonStyle(
                    backgroundColor: MaterialStatePropertyAll(
                        Color.fromARGB(255, 255, 255, 255)),
                    shape: MaterialStatePropertyAll(RoundedRectangleBorder(
                        side: BorderSide(color: Colors.black38),
                        borderRadius: BorderRadius.all(Radius.circular(30))))),
                onPressed: () {
                  Get.back();
                },
                child: Text(
                  '취소',
                  style: TextStyle(color: Colors.black38),
                ),
              ),
              ElevatedButton(
                style: ButtonStyle(
                    backgroundColor:
                        MaterialStatePropertyAll(Color(0xff3ED598)),
                    shape: MaterialStatePropertyAll(RoundedRectangleBorder(
                        borderRadius: BorderRadius.all(Radius.circular(30))))),
                onPressed: () async {
                  if (say.trim().isEmpty ||
                      favoriteSentences.contains(say.trim())) {
                    var duple = say.trim().isEmpty ? "입력된 말이 없어요" : "중복된 말입니다.";
                    Get.snackbar(duple, say,
                        duration: Duration(seconds: 1),
                        snackPosition: SnackPosition.BOTTOM,
                        backgroundColor:
                            const Color.fromARGB(137, 255, 114, 114),
                        margin: EdgeInsets.only(bottom: 10));
                    return;
                  }
                  if (favoriteSentences.length >= 10) {
                    Get.snackbar("다 찼어요", "10개의 자주쓰는 말이 이미 등록되어 있어요.",
                        duration: Duration(seconds: 1),
                        snackPosition: SnackPosition.BOTTOM,
                        backgroundColor:
                            const Color.fromARGB(137, 255, 114, 114),
                        margin: EdgeInsets.only(bottom: 10));
                    return;
                  }

                  createfavorite(say.trim());
                  Get.back();
                  Get.snackbar("등록 성공",
                      "총 ${favoriteSentences.length + 1} 개의 자주 쓰는 말이 있어요",
                      duration: Duration(seconds: 1),
                      snackPosition: SnackPosition.BOTTOM,
                      backgroundColor: Color.fromARGB(136, 174, 255, 92),
                      margin: EdgeInsets.only(bottom: 10));
                },
                child: Text('추가하기'),
              ),
            ],
          )
        ],
      ),
    );
  }

  GestureDetector recommendSay(BuildContext context, Size size, saying) {
    final chatController = Get.put(ChatController());
    return GestureDetector(
      onTap: () {
        widget.textController.text = saying;
        chatController.changeSaying(saying);
        Get.back();
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          SizedBox(
            width: size.width * 0.6,
            child: Bubble(
              radius: Radius.circular(14),
              elevation: 0.8,
              shadowColor: Colors.black45,
              borderColor: Colors.black26,
              color: Colors.white,
              padding: BubbleEdges.fromLTRB(15, 10, 15, 10),
              alignment: Alignment.centerRight,
              nip: BubbleNip.rightTop,
              child: AutoSizeText(
                saying,
                style: TextStyle(fontSize: 20),
                maxLines: 3,
                textAlign: TextAlign.right,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
