import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/blue_test_controller.dart';
import 'package:hearo_app/controller/login_controller.dart';
import 'package:hearo_app/screens/chats/sign_lang.dart';
import 'package:hearo_app/screens/glasses/chat_home_glasses.dart';
import 'package:hearo_app/screens/glasses/sound_class_glass.dart';
import 'package:hearo_app/screens/mysettings/favorite_say.dart';
import 'package:hearo_app/widgets/common/custom_app_bar_glasses.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:animated_toggle_switch/animated_toggle_switch.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'dart:async';

class HomeScreenGlasses extends StatefulWidget {
  HomeScreenGlasses({super.key});

  @override
  State<HomeScreenGlasses> createState() => _HomeScreenGlassesState();
}

getPermissionCamera() async {
  var statusCamera = await Permission.camera.status;
  if (statusCamera.isGranted) {
    print('허락됨2Cameratooth');
  } else if (statusCamera.isDenied) {
    print('거절됨2Cameratooth');
    Permission.camera.request();
  }
}

class _HomeScreenGlassesState extends State<HomeScreenGlasses> {
  LoginController loginController = Get.put(LoginController());
  DateTime? firstPress;
  int value = 0;
  bool positive = false;
  bool loading = false;
  BlueTestController bluetoothController = Get.find<BlueTestController>();
  @override
  void initState() {
    super.initState();
    if (bluetoothController.state.value == BluetoothDeviceState.connected) {
      positive = true;
    } else {
      positive = false;
    }
    getPermissionCamera(); // 상태 연결 리스너 등록
    bluetoothController.setupNotification();
    bluetoothController.subscribeToCharacteristic;
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return WillPopScope(
      onWillPop: onWillPop,
      child: Scaffold(
        appBar: CustomMainAppBarGlasses(),
        body: SizedBox(
          width: size.width,
          height: size.height,
          child: Column(
            children: [
              Flexible(
                flex: 1,
                child: Container(
                  decoration: BoxDecoration(
                    color: Color(0xffFAFAFA),
                    borderRadius: const BorderRadius.only(
                        bottomLeft: Radius.circular(30),
                        bottomRight: Radius.circular(30)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.transparent.withOpacity(0.25),
                        spreadRadius: 0,
                        blurRadius: 1.0,
                        offset:
                            const Offset(0, 4), // changes position of shadow
                      ),
                    ],
                  ),
                  margin: const EdgeInsets.symmetric(vertical: 5),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  width: size.width,
                  child: Column(
                    children: [
                      AnimatedToggleSwitch<bool>.dual(
                        current: positive,
                        first: false,
                        second: true,
                        dif: 80.0,
                        borderColor: Colors.transparent,
                        borderWidth: 5.0,
                        innerColor: positive
                            ? Color.fromARGB(255, 255, 206, 206)
                            : const Color.fromARGB(255, 206, 233, 255),
                        height: 60,
                        boxShadow: const [
                          BoxShadow(
                            color: Colors.black26,
                            spreadRadius: 1,
                            blurRadius: 2,
                            offset: Offset(0, 1.5),
                          ),
                        ],
                        onChanged: (b) {
                          print(b);
                          setState(() {
                            if (bluetoothController.state.value ==
                                BluetoothDeviceState.connected) {
                              positive = true;
                            } else {
                              positive = false;
                            }
                          });
                          return Future.delayed(Duration(seconds: 4));
                        },
                        onTap: () {
                          if (positive) {
                            bluetoothController.disconnect();
                          } else {
                            bluetoothController.readData();
                          }
                        },
                        colorBuilder: (b) => b
                            ? Color.fromARGB(188, 255, 126, 117)
                            : Color.fromARGB(255, 103, 174, 255),
                        iconBuilder: (value) => value
                            ? Image.asset("assets/images/banglass.png")
                            : Image.asset("assets/images/glasses.png"),
                        textBuilder: (value) => value
                            ? Center(
                                child: Text(
                                'Glass - OFF',
                                style: TextStyle(
                                    fontSize: 18,
                                    color: Color.fromARGB(255, 159, 159, 159)),
                              ))
                            : Center(
                                child: Text(
                                'Glass - ON',
                                style:
                                    TextStyle(fontSize: 18, color: Colors.blue),
                              )),
                      ),
                    ],
                  ),
                ),
              ),
              // 네비게이션 버튼들
              Flexible(
                flex: 6,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 10, 20, 5),
                  child: Column(children: [
                    InkWell(
                      onTap: () {
                        Get.to(() => ChatHomeGlasses());
                      },
                      child: naviButton(size, 0),
                    ),
                    InkWell(
                      onTap: () {
                        Get.to(() => SoundClassGlass());
                      },
                      child: naviButton(size, 2),
                    ),
                    InkWell(
                      onTap: () {
                        Get.to(() => SignLang());
                      },
                      child: naviButton(size, 1),
                    ),
                    Expanded(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          InkWell(
                              focusColor: Color(0xff1A73E8),
                              onTap: () {
                                Get.to(() => FavoriteSay());
                              },
                              child: settingButton(size, 0)),
                          InkWell(
                              onTap: () async {
                                await openAppSettings();
                              },
                              child: settingButton(size, 1)),
                        ],
                      ),
                    )
                  ]),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  Container settingButton(Size size, int idx) {
    final info = [
      {
        "img": "assets/images/free-icon-favorites-5432410.png",
        "txt": "자주 쓰는 말"
      },
      {"img": "assets/images/setperm.png", "txt": "앱 권한 설정"},
    ];
    return Container(
      width: size.width * 0.26,
      height: size.width * 0.26,
      decoration: BoxDecoration(
        border: Border.all(color: const Color.fromARGB(31, 233, 233, 233)),
        color: Colors.white,
        borderRadius: const BorderRadius.all(Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: Colors.transparent.withOpacity(0.10),
            spreadRadius: 1,
            blurRadius: 4.0,
            offset: const Offset(1, 2), // changes position of shadow
          ),
        ],
      ),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Flexible(
          flex: 1,
          child: Image.asset(info[idx]["img"]!),
        ),
        Flexible(
          flex: 1,
          child: Text(info[idx]["txt"]!),
        )
      ]),
    );
  }

  Container naviButton(Size size, int idx) {
    final info = [
      {"img": "assets/images/conversation.png", "txt": "대화 나누기"},
      {"img": "assets/images/signlang.png", "txt": "수어 인식"},
      {"img": "assets/images/alarm.png", "txt": "주변 소음 인식"},
    ];
    return Container(
      margin: EdgeInsets.only(bottom: 10),
      height: size.height * 0.13,
      decoration: BoxDecoration(
        border: Border(
            bottom:
                BorderSide(color: Color.fromARGB(31, 136, 175, 255), width: 3)),
        color: Colors.transparent,
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Padding(
                  padding: const EdgeInsets.all(10),
                  child: Image.asset(info[idx]["img"]!),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 20),
                  child: Text(info[idx]["txt"]!,
                      textAlign: TextAlign.left,
                      style: TextStyle(fontSize: 28)),
                ),
              ],
            ),
            IconButton(
                onPressed: () {
                  if (idx == 0) {
                    showModalBottomSheet(
                      context: context,
                      builder: (context) {
                        return Image.asset("assets/images/temp1.png");
                      },
                    );
                  } else if (idx == 2) {
                    showModalBottomSheet(
                      context: context,
                      builder: (context) {
                        return Image.asset("assets/images/temp2.png");
                      },
                    );
                  } else {
                    showModalBottomSheet(
                      context: context,
                      builder: (context) {
                        return Image.asset("assets/images/temp3.png");
                      },
                    );
                  }
                },
                icon: Icon(
                  Icons.help_outline_rounded,
                  size: 28,
                ))
          ],
        ),
      ),
    );
  }

  // 뒤로 두 번 눌러야 앱 꺼짐
  Future<bool> onWillPop() {
    DateTime now = DateTime.now();
    if (firstPress == null ||
        now.difference(firstPress!) > Duration(seconds: 2)) {
      firstPress = now;
      const msg = "뒤로 버튼을 한 번 더 누르시면 종료됩니다.";
      final snackBar = SnackBar(content: Text(msg));
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return Future.value(false);
    }
    return Future.value(true);
  }
}
