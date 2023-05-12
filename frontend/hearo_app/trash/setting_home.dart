import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/apis/login_api.dart';
import 'package:hearo_app/controller/login_controller.dart';
import 'package:hearo_app/screens/login_screen.dart';
import 'package:hearo_app/screens/mysettings/favorite_say.dart';
import 'package:hearo_app/screens/mysettings/setting_screen.dart';
import 'package:hearo_app/widgets/common/custom_app_bar_inner.dart';
import 'package:permission_handler/permission_handler.dart';

class SettingHome extends StatefulWidget {
  SettingHome({super.key});

  @override
  State<SettingHome> createState() => _SettingHomeState();
}

class _SettingHomeState extends State<SettingHome> {
  LoginController loginController = Get.put(LoginController());

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: CustomAppBarInner(name: "내 정보"),
      body: Container(
        margin: EdgeInsets.only(top: 30),
        width: size.width,
        child: Column(mainAxisAlignment: MainAxisAlignment.start, children: [
          Flexible(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: ClipOval(
                  child: Image.network(
                    loginController.loginData[0]["profileImg"],
                    fit: BoxFit.cover,
                    width: 100,
                    height: 100,
                  ),
                ),
              )),
          Flexible(
            flex: 6,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Text(
                  loginController.loginData[0]["nickname"],
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
                ),
                Container(
                    padding: EdgeInsets.only(top: 10, bottom: 25),
                    child: Text(loginController.loginData[0]["email"],
                        style: TextStyle(fontSize: 16))),
                GestureDetector(
                  onTap: () {
                    Get.to(() => FavoriteSay());
                  },
                  child: Container(
                    width: size.width * 0.9,
                    padding: EdgeInsets.symmetric(vertical: 22),
                    decoration: BoxDecoration(
                        border: Border(
                            top: BorderSide(color: Colors.black12, width: 1))),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Icon(Icons.book_outlined),
                              Padding(
                                padding: const EdgeInsets.only(left: 15),
                                child: Text("자주 쓰는 말",
                                    style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.w600)),
                              )
                            ],
                          ),
                          Icon(Icons.arrow_forward_ios_rounded)
                        ],
                      ),
                    ),
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    Get.to(() => SettingScreen());
                  },
                  child: Container(
                    width: size.width * 0.9,
                    padding: EdgeInsets.symmetric(vertical: 22),
                    decoration: BoxDecoration(
                        border: Border(
                            top: BorderSide(color: Colors.black12, width: 1))),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.settings_outlined,
                              ),
                              Padding(
                                padding: const EdgeInsets.only(left: 15),
                                child: Text("음성 설정",
                                    style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.w600)),
                              )
                            ],
                          ),
                          Icon(Icons.arrow_forward_ios_rounded)
                        ],
                      ),
                    ),
                  ),
                ),
                GestureDetector(
                  onTap: () async {
                    await openAppSettings();
                  },
                  child: Container(
                    width: size.width * 0.9,
                    padding: EdgeInsets.symmetric(vertical: 22),
                    decoration: BoxDecoration(
                        border: Border(
                            top: BorderSide(color: Colors.black12, width: 1))),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.perm_camera_mic_outlined,
                              ),
                              Padding(
                                padding: const EdgeInsets.only(left: 15),
                                child: Text("앱 권한 설정",
                                    style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.w600)),
                              )
                            ],
                          ),
                          Icon(Icons.arrow_forward_ios_rounded)
                        ],
                      ),
                    ),
                  ),
                ),
                Container(
                  width: size.width * 0.9,
                  padding: EdgeInsets.symmetric(vertical: 22),
                  decoration: BoxDecoration(
                      border: Border(
                    top: BorderSide(color: Colors.black12, width: 1),
                    bottom: BorderSide(color: Colors.black12, width: 1),
                  )),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Icon(Icons.info_outline),
                            Padding(
                              padding: const EdgeInsets.only(left: 15),
                              child: Text("튜토리얼 다시보기",
                                  style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.w600)),
                            )
                          ],
                        ),
                        Icon(Icons.arrow_forward_ios_rounded)
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          Flexible(
            flex: 1,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 70),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  TextButton(
                    onPressed: () => showDialog(
                      context: context,
                      builder: (BuildContext context) => AlertDialog(
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20)),
                        title: const Text(
                          '로그아웃',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        content: const Text(
                          '로그아웃 하시겠습니까?',
                          textAlign: TextAlign.center,
                        ),
                        actions: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              ElevatedButton(
                                style: ButtonStyle(
                                    backgroundColor: MaterialStatePropertyAll(
                                        Color.fromARGB(255, 255, 255, 255)),
                                    shape: MaterialStatePropertyAll(
                                        RoundedRectangleBorder(
                                            side: BorderSide(
                                                color: Colors.black38),
                                            borderRadius: BorderRadius.all(
                                                Radius.circular(30))))),
                                onPressed: () {
                                  Get.back();
                                },
                                child: const Text(
                                  '돌아가기',
                                  style: TextStyle(color: Colors.black38),
                                ),
                              ),
                              ElevatedButton(
                                style: ButtonStyle(
                                    backgroundColor: MaterialStatePropertyAll(
                                        Color(0xff1A73E8)),
                                    shape: MaterialStatePropertyAll(
                                        RoundedRectangleBorder(
                                            borderRadius: BorderRadius.all(
                                                Radius.circular(30))))),
                                onPressed: () {
                                  ApiLog.logoutApi();
                                  Get.offAll(LoginScreen());
                                },
                                child: const Text(
                                  '로그아웃',
                                ),
                              ),
                            ],
                          )
                        ],
                      ),
                    ),
                    child: Text(
                      "로그아웃",
                      style: TextStyle(
                          color: Color(0xff1A73E8),
                          fontSize: 20,
                          fontWeight: FontWeight.w500),
                    ),
                  ),
                  TextButton(
                    onPressed: () => showDialog(
                      context: context,
                      builder: (BuildContext context) => AlertDialog(
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20)),
                        title: const Text(
                          '회원탈퇴',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        content: SizedBox(
                          height: size.height * 0.08,
                          child: Column(
                            children: [
                              const Text(
                                '정말로 탈퇴 하시겠습니까?',
                                textAlign: TextAlign.center,
                              ),
                              const Text(
                                '정보 복구가 어려울 수 있습니다.',
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                        actions: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              ElevatedButton(
                                style: ButtonStyle(
                                    backgroundColor: MaterialStatePropertyAll(
                                        Color.fromARGB(255, 255, 255, 255)),
                                    shape: MaterialStatePropertyAll(
                                        RoundedRectangleBorder(
                                            side: BorderSide(
                                                color: Colors.black38),
                                            borderRadius: BorderRadius.all(
                                                Radius.circular(30))))),
                                onPressed: () {
                                  Get.back();
                                },
                                child: const Text(
                                  '돌아가기',
                                  style: TextStyle(color: Colors.black38),
                                ),
                              ),
                              ElevatedButton(
                                style: ButtonStyle(
                                    backgroundColor: MaterialStatePropertyAll(
                                        Color(0xff1A73E8)),
                                    shape: MaterialStatePropertyAll(
                                        RoundedRectangleBorder(
                                            borderRadius: BorderRadius.all(
                                                Radius.circular(30))))),
                                onPressed: () {
                                  ApiLog.withdrawApi();
                                  Get.offAll(LoginScreen());
                                },
                                child: const Text(
                                  '탈퇴하기',
                                ),
                              ),
                            ],
                          )
                        ],
                      ),
                    ),
                    child: Text(
                      "회원 탈퇴",
                      style: TextStyle(
                          color: Color(0xff929292),
                          fontSize: 20,
                          fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ),
          )
        ]),
      ),
    );
  }
}