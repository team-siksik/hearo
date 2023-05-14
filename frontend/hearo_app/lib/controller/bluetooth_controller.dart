import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class BluetoothController extends GetxController {
  final box = GetStorage();
  final flutterBlue = FlutterBluePlus.instance.obs;
  final List<ScanResult> scanResultList = [];
  // final bool _isScanning = false;
  final String targetDeviceName = 'HC-06';

  Rx<BluetoothDevice?> device = Rx<BluetoothDevice?>(null);
  // BluetoothCharacteristic 전역 상태 변수
  Rx<BluetoothCharacteristic?> writeCharacteristic =
      Rx<BluetoothCharacteristic?>(null);
  Rx<BluetoothCharacteristic?> readCharacteristic =
      Rx<BluetoothCharacteristic?>(null);

  @override
  void onInit() {
    super.onInit();
    // 이전에 저장된 값이 있는지 확인하고 읽어옵니다.
    String? writeCharacteristicId = box.read('writeCharacteristic');
    if (writeCharacteristicId != null) {
      // 저장된 값이 있으면 BluetoothCharacteristic 객체를 찾아서 할당합니다.
      writeCharacteristic.value = findCharacteristic(writeCharacteristicId);
    }

    String? readCharacteristicId = box.read('readCharacteristic');
    if (readCharacteristicId != null) {
      // 저장된 값이 있으면 BluetoothCharacteristic 객체를 찾아서 할당합니다.
      readCharacteristic.value = findCharacteristic(readCharacteristicId);
    }
  }

  void setDevice(BluetoothDevice bluetoothDevice) {
    device.value = bluetoothDevice;
    // 변경된 BluetoothDevice ID를 저장합니다.
    box.write('device', bluetoothDevice.id.toString());
  }

  void setWriteChar(BluetoothCharacteristic characteristic) {
    writeCharacteristic.value = characteristic;
    // 변경된 BluetoothCharacteristic ID를 저장합니다.
    box.write('writeCharacteristic', characteristic.uuid.toString());
  }

  void setReadChar(BluetoothCharacteristic characteristic) {
    readCharacteristic.value = characteristic;
    // 변경된 BluetoothCharacteristic ID를 저장합니다.
    box.write('readCharacteristic', characteristic.uuid.toString());
  }

  // BluetoothCharacteristic ID로 BluetoothCharacteristic 객체를 찾는 메서드
  BluetoothCharacteristic? findCharacteristic(String characteristicId) {
    return null;

    // 필요한 로직을 구현하여 BluetoothCharacteristic 객체를 반환합니다.
  }

  // 저장된 값 초기화
  void clear() {
    box.remove('writeCharacteristic');
    box.remove('readCharacteristic');
  }
}
