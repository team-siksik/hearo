// ignore_for_file: library_private_types_in_public_api

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class SocketTest extends StatefulWidget {
  const SocketTest({super.key});

  @override
  _SocketTestState createState() => _SocketTestState();
}

class _SocketTestState extends State<SocketTest> {
  BluetoothDevice? hc06Device;
  BluetoothCharacteristic? writeCharacteristic;
  BluetoothCharacteristic? notifyCharacteristic;
  Stream<List<int>>? notifyStream;
  List<int> receivedData = [];

  @override
  void initState() {
    super.initState();
    connectToDevice();
  }

  @override
  void dispose() {
    disconnectFromDevice();
    super.dispose();
  }

  Future<void> connectToDevice() async {
    FlutterBluePlus flutterBlue = FlutterBluePlus.instance;
    // HC-06의 MAC 주소를 사용하여 BluetoothDevice를 찾습니다.
    List<BluetoothDevice> devices = await flutterBlue.connectedDevices;
    hc06Device = devices.firstWhere(
      (device) => device.name == 'HC-06', // HC-06의 이름으로 필터링
    );

    if (hc06Device != null) {
      // HC-06을 이미 페어링한 경우 연결합니다.
      await hc06Device!.connect(autoConnect: false);
      // 서비스와 캐릭터리스틱을 찾아 저장합니다.
      List<BluetoothService> services = await hc06Device!.discoverServices();
      for (BluetoothService service in services) {
        for (BluetoothCharacteristic characteristic
            in service.characteristics) {
          if (characteristic.properties.write) {
            writeCharacteristic = characteristic;
          } else if (characteristic.properties.notify) {
            notifyCharacteristic = characteristic;
            notifyStream = notifyCharacteristic!.value;
            // 데이터 수신 리스너를 등록합니다.
            notifyStream!.listen((data) {
              setState(() {
                receivedData.addAll(data);
              });
            });
          }
        }
      }
    }
  }

  Future<void> disconnectFromDevice() async {
    if (hc06Device != null) {
      await hc06Device!.disconnect();
    }
  }

  void sendCommand(String command) {
    if (writeCharacteristic != null) {
      writeCharacteristic!.write(utf8.encode(command));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('HC-06 Microphone'),
      ),
      body: Center(
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        ElevatedButton(
          onPressed: () {
            sendCommand('음성 송신'); // 원하는 명령을 전달합니다.
          },
          child: Text('음성 송신'),
        ),
        SizedBox(height: 20),
        Text(
          '수신된 데이터:',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 10),
        Text(
          String.fromCharCodes(receivedData),
          style: TextStyle(fontSize: 16),
        ),
      ])),
    );
  }
}
