import "package:flutter/material.dart";
import "package:get/get.dart";
import "package:hearo_app/controller/blue_test_controller.dart";
import "package:hearo_app/models/blue_read.dart";
import "package:hearo_app/models/blue_write.dart";

class BlueInit extends StatefulWidget {
  BlueInit({super.key});

  @override
  State<BlueInit> createState() => _BlueInitState();
}

class _BlueInitState extends State<BlueInit> {
  final BlueTestController bluetoothController = Get.put(BlueTestController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("BlueInit")),
      body: Center(
          child: Column(
        children: [
          TextButton(
            onPressed: () {
              bluetoothController.initialize(); // 블루투스 연결
            },
            child: Text("블루투스 연결"),
          ),
          TextButton(
            onPressed: () {
              bluetoothController.disconnect(); // 블루투스 끊기
            },
            child: Text("블루투스 끊기"),
          ),
          TextButton(
            onPressed: () async {
              Get.to(() => BlueRead());
            },
            child: Text("블루투스 읽기"),
          ),
          TextButton(
            onPressed: () {
              Get.to(() => BlueWrite());
            },
            child: Text("블루투스 쓰기"),
          ),
        ],
      )),
    );
  }
}
