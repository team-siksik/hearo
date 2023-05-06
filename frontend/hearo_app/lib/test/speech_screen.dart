import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart';

class SpeechScreen extends StatefulWidget {
  const SpeechScreen({super.key});

  @override
  State<SpeechScreen> createState() => _SpeechScreenState();
}

class _SpeechScreenState extends State<SpeechScreen> {
  final SpeechToText _speech = SpeechToText();
  String saying = '';

  @override
  void initState() {
    super.initState();
    _initSpeechRecognition();
  }

  Future<void> _initSpeechRecognition() async {
    bool hasSpeech = await _speech.initialize(
      onError: (val) => print('Error: $val'),
      onStatus: (val) => print('Status: $val'),
    );

    if (hasSpeech) {
      _startListening();
    }
  }

  bool flag = false;
  void _startListening() async {
    setState(() {
      flag = false;
    });
    await _speech.listen(
      onResult: (val) => setState(() {
        saying = val.recognizedWords;
      }),
      listenFor: Duration(seconds: 10), // 듣기 지속 시간을 10초로 설정합니다.
      pauseFor: Duration(milliseconds: 0),
      partialResults: true,
    );
    bool hasSpeech = await _speech.initialize(
      onError: (val) => print('Error: $val'),
      onStatus: (val) {
        setState(() {
          flag = true;
        });
      },
    );
    if (true) {
      _startListening();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Speech To Text Demo'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(saying),
          ],
        ),
      ),
    );
  }
}
