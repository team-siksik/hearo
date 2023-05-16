import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class BleTest2 extends StatefulWidget {
  BleTest2({Key? key}) : super(key: key);

  @override
  State<BleTest2> createState() => _BleTest2State();
}

class _BleTest2State extends State<BleTest2> {
  // Bluetooth 연결 설정
  BluetoothDevice? device;
  BluetoothCharacteristic? characteristic;
  FlutterBluePlus flutterBlue = FlutterBluePlus.instance;
  final TextEditingController _textController = TextEditingController();
  StreamSubscription? scanSubscription;

  @override
  void initState() {
    super.initState();
    // HC-06 모듈을 찾습니다.
    scanForDevice();
  }

  Future<void> scanForDevice() async {
    // scanSubscription을 초기화합니다.
    scanSubscription?.cancel();

    // HC-06 모듈을 찾습니다.
    scanSubscription = flutterBlue.scan().listen((scanResult) async {
      if (scanResult.device.name == "HC-06") {
        // HC-06 모듈을 찾으면 장치를 연결합니다.
        await scanSubscription?.cancel();
        device = scanResult.device;
        await connectToDevice();
      }
    });
  }

  Future<void> connectToDevice() async {
    // 장치와 연결합니다.
    await device?.connect();
    // 서비스와 캐릭터리스틱을 찾습니다.
    List<BluetoothService> services = await device!.discoverServices();
    for (var service in services) {
      if (service.uuid.toString() == "0000ffe0-0000-1000-8000-00805f9b34fb") {
        characteristic = service.characteristics.firstWhere(
            (c) => c.uuid.toString() == "0000ffe0-0000-1000-8000-00805f9b34fb");
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("블루2"),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextField(
                controller: _textController,
                decoration: InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: '전송할 텍스트를 입력하세요',
                ),
              ),
              SizedBox(height: 16),
              ElevatedButton(
                onPressed: () async {
                  if (device == null) {
                    // HC-06 모듈을 찾지 못한 경우, 다시 검색합니다.
                    await scanForDevice();
                  } else {
                    // 텍스트 전송
                    List<int> bytes = utf8.encode(_textController.text);
                    await characteristic?.write(bytes);
                  }
                },
                child: Text('전송'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    scanSubscription?.cancel();
    super.dispose();
  }
}
