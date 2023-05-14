import 'package:flutter/material.dart';

Future showInfoFirst(context) async {
  return showDialog(
    context: context,
    barrierDismissible: false,
    builder: (BuildContext context) => AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: const Text(
        '대화 시작하기',
        textAlign: TextAlign.center,
        style: TextStyle(fontWeight: FontWeight.bold),
      ),
      content: const Text(
        '이 대화는 목소리가 텍스트로 전환되며, 전달하는 말은 스피커로 출력됩니다. 시스템 볼륨을 확인해주세요.',
        style: TextStyle(fontSize: 30, fontWeight: FontWeight.w700),
        textAlign: TextAlign.center,
      ),
    ),
  );
}
