// 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
import 'package:flutter/material.dart';
import 'package:chat_gpt_api/chat_gpt.dart';

class GptTemp extends StatefulWidget {
  const GptTemp({super.key});

  @override
  _GptTempState createState() => _GptTempState();
}

class _GptTempState extends State<GptTemp> {
  final chatGpt = ChatGPT.builder(
      token: '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');

  String prompt = "plz say one good saying";

  Future<void> getMessage() async {
    Completion? completion = await chatGpt.textCompletion(
      request: CompletionRequest(
        prompt: prompt,
        maxTokens: 256,
      ),
    );
    print(completion?.choices?[0]);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('GPT-3 Text Generation'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                onPressed: getMessage,
                child: const Text('Generate Text'),
              ),
              const SizedBox(height: 20),
              // Text(_generatedText),
            ],
          ),
        ),
      ),
    );
  }
}
