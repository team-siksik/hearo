import "dart:convert";

import "package:flutter/material.dart";
import "package:get/get.dart";
import "package:hearo_app/controller/blue_test_controller.dart";

class BlueWrite extends StatefulWidget {
  BlueWrite({super.key});

  @override
  State<BlueWrite> createState() => _BlueWriteState();
}

final controller = Get.find<BlueTestController>();
void sendMessageToGlasses(words) async {
  String data = words;
  List<int> bytes = utf8.encode(data);
  // print(characteristic);
  await controller.writeCharacteristic.value!.write(bytes);
  // setState(() {});
}

class _BlueWriteState extends State<BlueWrite> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("BlueWrite")),
      body: Center(
          child: Column(
        children: [
          TextButton(
            onPressed: () async {
              String data = "abc"; // 보낼 데이터
              sendMessageToGlasses(data);

              print('send data');
            },
            child: Text("블루투스 쓰기"),
          ),
        ],
      )),
    );
  }
}
