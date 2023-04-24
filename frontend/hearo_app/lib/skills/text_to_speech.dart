import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';

class TextToSpeech extends StatefulWidget {
  const TextToSpeech({super.key});

  @override
  State<TextToSpeech> createState() => _TextToSpeechState();
}

class _TextToSpeechState extends State<TextToSpeech> {
  final FlutterTts tts = FlutterTts();
  final TextEditingController ttsController =
      TextEditingController(text: "안녕하세요, TTS 테스트중입니다.");

  @override
  void initState() {
    super.initState();
    // 언어 설정
    tts.setLanguage("ko-KR");
    // 속도지정 (0.0이 제일 느리고 1.0이 제일 빠름)
    tts.setSpeechRate(0.6);
    // tts.setVoice({"name": "Karen"});
    // tts.getVoices;
    // tts.setVoice({"name": "ko-kr-x-ism-local", "locale": "ko-KR"});
    tts.setVoice({"name": "ko-kr-x-ism-network", "locale": "ko-KR"});
    // tts.setVoice({"name": "ko-kr-x-kob-network", "locale": "ko-KR"});

    // check();
  }

  //{name: ko-kr-x-ism-local,   locale: ko-KR}
  //{name: ko-kr-x-ism-network, locale: ko-KR}
  //{name: ko-kr-x-kob-network, locale: ko-KR}

  void check() async {
    final result =
        await myAsyncFunction(); // Future 객체의 반환 값을 대기하고, 반환 값을 변수에 할당
    print(result); // 반환 값 출력
  }

  Future<dynamic> myAsyncFunction() async {
    var what = tts.getVoices;
    return what; // 작업 완료 후 반환 값
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Test Title"),
      ),
      body: Column(
        children: [
          TextField(
            controller: ttsController,
          ),
          TextButton(
            onPressed: () => tts.speak(ttsController.text),
            child: Text("재생버튼"),
          ),
          FutureBuilder(
              future: tts.getVoices,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  return voiceList(snapshot, context);
                } else {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                }
              })
        ],
      ),
    );
  }
}

SizedBox voiceList(AsyncSnapshot snapshot, context) {
  Size size = MediaQuery.of(context).size;
  return SizedBox(
    height: size.height * 0.6,
    child: Center(
      child: ListView.separated(
        itemBuilder: (context, index) {
          var infos = snapshot.data![index];
          // print(infos);
          return Row(
            children: [
              // Text("${infos.name.toString()} :"),
              // Text(infos.locale.toString())
            ],
          );
        },
        separatorBuilder: (context, index) => const SizedBox(
          height: 10,
        ),
        itemCount: snapshot.data!.length,
      ),
    ),
  );
}
