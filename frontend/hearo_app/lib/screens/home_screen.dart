import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/login_controller.dart';
import 'package:hearo_app/screens/chats/chat_home.dart';
import 'package:hearo_app/screens/mysettings/favorite_say.dart';
import 'package:hearo_app/test/screen2.dart';
import 'package:hearo_app/test/speech_screen.dart';
import 'package:hearo_app/widgets/common/custom_app_bar.dart';
import 'package:permission_handler/permission_handler.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
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

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    getPermissionCamera();
  }

  LoginController loginController = Get.put(LoginController());
  DateTime? firstPress;
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return WillPopScope(
      onWillPop: onWillPop,
      child: Scaffold(
        appBar: CustomMainAppBar(),
        body: SizedBox(
          width: size.width,
          height: size.height,
          child: Column(
            children: [
              // 안녕하세요 ~ 환영해요 부분
              SizedBox(
                width: size.width,
                child: Padding(
                  padding: EdgeInsets.fromLTRB(20, 0, 0, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "안녕하세요, ${loginController.loginData[0]["nickname"]}님",
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w600),
                      ),
                      Padding(
                        padding: EdgeInsets.fromLTRB(0, 5, 0, 0),
                        child: Row(
                          children: [
                            Text(
                              "히어로",
                              style: TextStyle(
                                  fontSize: 14,
                                  color: Color(0xff1A73E8),
                                  fontWeight: FontWeight.w600),
                            ),
                            Text(
                              "에 오신 것을 환영해요.",
                              style: TextStyle(fontSize: 14),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // 광고 부분 캐러셀
              Flexible(
                flex: 1,
                child: Container(
                    decoration: BoxDecoration(
                      color: Color(0xffFAFAFA),
                      borderRadius: const BorderRadius.only(
                          bottomLeft: Radius.circular(100),
                          bottomRight: Radius.circular(100)),
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
                    child: SizedBox()),
              ),
              // 네비게이션 버튼들
              Flexible(
                flex: 10,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 10, 20, 5),
                  child: Column(children: [
                    InkWell(
                      onTap: () {
                        Get.to(() => ChatHome());
                      },
                      child: naviButton(size, 0),
                    ),
                    InkWell(
                      onTap: () {
                        Get.to(Screen2());
                      },
                      child: naviButton(size, 1),
                    ),
                    InkWell(
                      onTap: () {
                        Get.to(SpeechScreen());
                      },
                      child: naviButton(size, 2),
                    ),
                    Expanded(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          InkWell(
                              focusColor: Color(0xff1A73E8),
                              onTap: () {
                                Get.to(FavoriteSay());
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
      {"img": "assets/images/glasses.png", "txt": "안경 이용 대화"},
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
            Icon(
              Icons.help_outline_rounded,
              size: 28,
            )
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
