import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/apis/login_api.dart';
import 'package:hearo_app/controller/login_controller.dart';
import 'package:hearo_app/screens/login_screen.dart';
import 'package:hearo_app/test/socket_test.dart';
import 'package:hearo_app/widgets/common/custom_app_bar_inner.dart';

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
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Flexible(
              flex: 3,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  ClipOval(
                    child: Image.network(
                      loginController.loginData[0]["profileImg"],
                      fit: BoxFit.cover,
                      width: 150,
                      height: 150,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 20),
                    child: Text(
                      loginController.loginData[0]["nickname"],
                      style:
                          TextStyle(fontSize: 28, fontWeight: FontWeight.w700),
                    ),
                  ),
                  Container(
                      padding: EdgeInsets.only(top: 10, bottom: 25),
                      child: Text(loginController.loginData[0]["email"],
                          style: TextStyle(fontSize: 18))),
                ],
              ),
            ),
            Flexible(
                flex: 1,
                child: TextButton(
                    onPressed: () {
                      Get.to(() => SocketTest());
                    },
                    child: Text("소켓 실험"))),
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
                                          Color(0xffe63e43)),
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
                            color: Color(0xffe63e43),
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
                                          Color(0xffe63e43)),
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
          ],
        ),
      ),
    );
  }
}
