import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/bluetooth_controller.dart';
import 'package:hearo_app/screens/glasses/home_screen_glasses.dart';

class BlueSearch extends StatefulWidget {
  const BlueSearch({super.key});

  @override
  State<BlueSearch> createState() => _Screen2State();
}

class _Screen2State extends State<BlueSearch> {
  BluetoothController bluetoothController = Get.put(BluetoothController());
  FlutterBluePlus flutterBlue = FlutterBluePlus.instance;
  List<ScanResult> scanResultList = [];
  bool _isScanning = false;
  final String targetDeviceName = 'HC-06';

  @override
  initState() {
    super.initState();
    setState(() {
      scanResultList = bluetoothController.scanResultList;
    });
    flutterBlue.connectedDevices.asStream().listen((devices) {
      for (BluetoothDevice device in devices) {
        if (device.name == targetDeviceName) {
          Get.to(() => HomeScreenGlasses(device: device));
        }
      }
    });

    // 블루투스 초기화
    initBle();
  }

  void initBle() {
    // BLE 스캔 상태 얻기 위한 리스너
    flutterBlue.isScanning.listen((isScanning) {
      _isScanning = isScanning;
      setState(() {});
    });
    scan();
  }

  /*
  스캔 시작/정지 함수
  */
  scan() async {
    if (!_isScanning) {
      // 스캔 중이 아니라면
      // 기존에 스캔된 리스트 삭제
      scanResultList.clear();
      // 스캔 시작, 제한 시간 4초
      flutterBlue.startScan(timeout: Duration(seconds: 4));
      // 스캔 결과 리스너
      flutterBlue.scanResults.listen((results) {
        // 결과 값을 루프로 돌림
        for (var element in results) {
          //찾는 장치명인지 확인
          if (element.device.name == targetDeviceName) {
            // 장치의 ID를 비교해 이미 등록된 장치인지 확인
            if (scanResultList
                    .indexWhere((e) => e.device.id == element.device.id) <
                0) {
              // 찾는 장치명이고 scanResultList에 등록된적이 없는 장치라면 리스트에 추가
              bluetoothController.setDevice(element.device);

              Get.to(HomeScreenGlasses(device: element.device));
            }
          }
        }
      });
    } else {
      // 스캔 중이라면 스캔 정지
      flutterBlue.stopScan();
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.sizeOf(context);
    return Scaffold(
      body: SizedBox(
        height: size.height,
        child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            /* 장치 리스트 출력 */
            children: [
              Flexible(
                flex: 3,
                child: SizedBox(
                  height: 100,
                  width: size.width,
                  // child: Text('블루투스'),
                ),
              ),
              Flexible(
                  flex: 10,
                  child: Center(
                    child: SizedBox(
                      width: size.width,
                      height: size.width,
                      child: InkWell(
                        onTap: scan,
                        child: SizedBox(
                          height: 250,
                          width: 250,
                          child: Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                SizedBox(
                                  height: 200,
                                  width: 200,
                                  child: Image.asset(_isScanning
                                      ? "assets/images/findblue.png"
                                      : "assets/images/searchglass.png"),
                                ),
                                Text(_isScanning
                                    ? "H - Glass 찾는중..."
                                    : "H - Glass 찾기위해 클릭")
                              ]),
                        ),
                      ),
                    ),
                  )),
            ]),
      ),
    );
  }
}
