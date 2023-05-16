import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/blue_test_controller.dart';
import 'package:hearo_app/screens/glasses/home_screen_glasses.dart';

class BlueSearch extends StatefulWidget {
  const BlueSearch({super.key});

  @override
  State<BlueSearch> createState() => _Screen2State();
}

class _Screen2State extends State<BlueSearch> {
  final BlueTestController bluetoothController = Get.put(BlueTestController());

  bool isScanning = false;

  @override
  initState() {
    super.initState();
    if (bluetoothController.device.value?.state != null) {
      Get.to(() => HomeScreenGlasses());
    }

    setState(() {
      isScanning = false;
    });
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
                ),
              ),
              Flexible(
                  flex: 10,
                  child: Center(
                    child: SizedBox(
                      width: size.width,
                      height: size.width,
                      child: InkWell(
                        onTap: () async {
                          print("@@@@@@@@@@@@@@@");
                          print(bluetoothController.state.value);
                          print(BluetoothDeviceState.connected);
                          print(bluetoothController.device.value?.state);
                          print(
                              '${bluetoothController.writeCharacteristic.toString()} @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                          print(
                              '${bluetoothController.flag.value} @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                          bluetoothController.device.value?.state
                              .listen((BluetoothDeviceState state) {
                            if (state == BluetoothDeviceState.connected) {
                              // 블루투스 장치가 연결된 경우 HomeScreenGlasses로 이동
                              Get.to(() => HomeScreenGlasses());
                            }
                          });
                          setState(() {
                            isScanning = true;
                            bluetoothController.initialize();
                          });
                          if (bluetoothController.device.value?.state != null) {
                            Get.to(() => HomeScreenGlasses());
                          }
                          await Future.delayed(Duration(seconds: 4));
                          setState(() {
                            isScanning = false;
                          });
                        },
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
                                  child: Image.asset(isScanning
                                      ? "assets/images/findblue.png"
                                      : "assets/images/searchglass.png"),
                                ),
                                Text(isScanning
                                    ? "H - Glass 찾는중..."
                                    : "H - Glass 찾기위해 클릭"),
                                TextButton(
                                    onPressed: () {
                                      bluetoothController.disconnect();
                                    },
                                    child: Text("연결해제"))
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
