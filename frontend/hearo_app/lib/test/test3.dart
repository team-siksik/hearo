import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class Test3 extends StatefulWidget {
  const Test3({super.key});

  @override
  State<Test3> createState() => _Test3State();
}

class _Test3State extends State<Test3> {
  FlutterBluePlus flutterBlue = FlutterBluePlus.instance;
  late BluetoothDevice hc06Device;
  late BluetoothCharacteristic writeCharacteristic;

  @override
  void initState() {
    super.initState();
    _initBluetooth();
  }

  void _initBluetooth() async {
    await flutterBlue.startScan(timeout: Duration(seconds: 4));

    flutterBlue.scanResults.listen((results) {
      for (ScanResult result in results) {
        if (result.device.name == 'HC-06') {
          hc06Device = result.device;
        }
      }
    });

    flutterBlue.stopScan();
    _connectToDevice();
  }

  void _connectToDevice() async {
    await hc06Device.connect();
    List<BluetoothService> services = await hc06Device.discoverServices();

    for (var service in services) {
      for (var characteristic in service.characteristics) {
        if (characteristic.uuid.toString() ==
            '0000ffe1-0000-1000-8000-00805f9b34fb') {
          writeCharacteristic = characteristic;
        }
      }
    }
  }

  void _sendData() async {
    List<int> dataToSend = utf8.encode('Hello, HC-06!');

    await writeCharacteristic.write(dataToSend);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Bluetooth HC-06'),
      ),
      body: Center(
        child: TextButton(
          onPressed: _sendData,
          child: Text('Send Data'),
        ),
      ),
    );
  }
}
