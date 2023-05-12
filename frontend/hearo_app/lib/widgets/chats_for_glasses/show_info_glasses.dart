import 'package:flutter/material.dart';

Future showInfoGlasses(context) async {
  return showDialog(
    context: context,
    builder: (BuildContext context) => AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: const Text(
        '대화 시작하기',
        textAlign: TextAlign.center,
        style: TextStyle(fontWeight: FontWeight.bold),
      ),
      content: const Text(
        '어쩌구저쩌구 엄청 긴 정보 내용 어쩌구저쩌구 엄청 긴 정보 내용 어쩌구저쩌구 엄청 긴 정보 내용 어쩌구저쩌구 엄청 긴 정보 내용',
        style: TextStyle(fontSize: 30, fontWeight: FontWeight.w700),
        textAlign: TextAlign.center,
      ),
    ),
  );
}
