import 'dart:convert';

import 'package:get/get.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class BlueTestController extends GetxController {
  // HC-06 블루투스 기기를 찾을 때 사용할 이름
  static const String deviceName = 'HC-06';

  // Write가 가능한 UUID
  static const String writeCharacteristicUuid =
      '0000ffe2-0000-1000-8000-00805f9b34fb';

  // 전역 상태
  var device = Rx<BluetoothDevice?>(null);
  var writeCharacteristic = Rx<BluetoothCharacteristic?>(null);
  var readCharacteristic = Rx<BluetoothCharacteristic?>(null);
  var state = Rx<BluetoothState?>(null);
  Rx<String> value = Rx("");
  Rx<String> flag = Rx("3");
  final flutterBlue = FlutterBluePlus.instance;

  @override
  void onInit() {
    super.onInit();
    // 화면이 로드된 후에 initialize 함수를 호출하도록 변경
    Future.delayed(Duration.zero, () async {
      initialize();
    });

    // Bluetooth 상태 구독
    subscribeToBluetoothState();
  }

  void initialize() async {
    // 이미 스캔 중이라면 스캔 중지
    if (state.value != null) {
      await flutterBlue.stopScan();
    }
    // 기기 검색
    flutterBlue.scan().listen((scanResult) async {
      if (scanResult.device.name == deviceName) {
        // HC-06 기기를 찾았다면 스캔 중지
        flutterBlue.stopScan();

        // 기기 저장
        device.value = scanResult.device;
        print(device.value);
        // 기기와 연결
        try {
          await device.value!.connect();
        } catch (e) {
          print('Connection failed: $e');
          return;
        }

        // 서비스와 특성 찾기
        List<BluetoothService> services =
            await device.value!.discoverServices();
        for (BluetoothService service in services) {
          for (BluetoothCharacteristic c in service.characteristics) {
            // write가 가능한 특성을 찾았다면 저장
            if (c.uuid.toString() == writeCharacteristicUuid) {
              writeCharacteristic.value = c;
            } else if (c.properties.notify) {
              readCharacteristic.value = c;
              subscribeToCharacteristic();
            }
          }
        }
      }
    });
  }

  // 블루투스 상태 구독
  void subscribeToBluetoothState() {
    flutterBlue.state.listen((newState) {
      state.value = newState;
    });
  }

  // 특성 변경 구독
  void subscribeToCharacteristic() {
    readCharacteristic.value!.setNotifyValue(true).then((_) {
      readCharacteristic.value!.value.listen((value) {
        print(value);
        flag.value = utf8.decode(value);
        print(flag.value);
      });
    });
  }

  bool isConnected() {
    return device.value!.state == BluetoothDeviceState.connected;
  }

  // Characteristics를 통해 데이터 읽기
  void readData() async {
    if (writeCharacteristic.value != null) {
      List<int> data = await writeCharacteristic.value!.read();
      String dataStr = String.fromCharCodes(data);
      print('Received data: $dataStr');
      value.value = dataStr; // Rx 데이터를 저장하는 value라는 이름의 RxString 변수를 가정
    }
  }

  // Characteristics를 통해 데이터 쓰기
  Future<bool> writeData(List<int> data) async {
    if (writeCharacteristic.value != null) {
      await writeCharacteristic.value!.write(data);
      return true;
    }
    return false;
  }

  // 연결 끊기
  void disconnect() async {
    if (device.value != null) {
      await device.value!.disconnect();
      print(device.value!.state);
      print("ASDFASDFASDDSFASDAFAFSD");
    }
  }

  void setupNotification() async {
    await writeCharacteristic.value!.setNotifyValue(true);
    writeCharacteristic.value!.value.listen((value) {
      String dataStr = String.fromCharCodes(value);
      print('Received data: $dataStr');
      this.value.value = dataStr; // 이전에 설명한대로, RxString 변수인 value에 데이터를 저장
    });
  }
}
