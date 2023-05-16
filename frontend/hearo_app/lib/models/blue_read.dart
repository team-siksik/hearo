import "package:flutter/material.dart";
import "package:get/get.dart";
import "package:hearo_app/controller/blue_test_controller.dart";

class BlueRead extends StatefulWidget {
  BlueRead({super.key});

  @override
  State<BlueRead> createState() => _BlueReadState();
}

final controller = Get.find<BlueTestController>();
dynamic txt = '';

class _BlueReadState extends State<BlueRead> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("BlueRead")),
      body: Center(
          child: Column(
        children: [
          TextButton(
            onPressed: () {
              controller.setupNotification();
            },
            child: Text("블루투스 연결"),
          ),
          TextButton(
            onPressed: controller.readData,
            child: Text("블루투스 읽기"),
          ),
          Obx(() {
            if (controller.value.value.isEmpty) {
              return Text('Waiting for data...');
            } else {
              return Text('Received data: ${controller.value.value}');
            }
          })
        ],
      )),
    );
  }
}
