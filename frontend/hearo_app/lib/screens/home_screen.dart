import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/login_controller.dart';
import 'package:hearo_app/screens/chats/chat_home.dart';
import 'package:hearo_app/test/screen1.dart';
import 'package:hearo_app/test/screen2.dart';
import 'package:hearo_app/widgets/common/carousel_widget.dart';
import 'package:hearo_app/widgets/common/custom_app_bar.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  LoginController loginController = Get.put(LoginController());
  DateTime? firstPress;
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    print(loginController.loginData);

    return WillPopScope(
      onWillPop: onWillPop,
      child: Scaffold(
        appBar: const CustomMainAppBar(),
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
                                  color: Color(0xffe63e43),
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
                          bottomLeft: Radius.circular(14),
                          bottomRight: Radius.circular(14)),
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
                    child:
                        // Image.asset("assets/images/temp1.png", fit: BoxFit.cover),
                        const CarouselWidget()),
              ),
              // 네비게이션 버튼들
              Flexible(
                flex: 2,
                child: Column(children: [
                  Container(
                    margin: const EdgeInsets.only(
                        top: 40, bottom: 40, left: 40, right: 40),
                    child: ElevatedButton(
                        onPressed: () {
                          Get.to(() => ChatHome());
                        },
                        style: ElevatedButton.styleFrom(
                            elevation: 4,
                            minimumSize:
                                Size(size.width * 0.8, size.width * 0.24),
                            backgroundColor: const Color(0xffF35D61),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14))),
                        child: Row(
                          children: [
                            Image.asset("assets/images/start1.png"),
                            const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text("대화 시작하기",
                                    style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.w600)),
                                Text("상대방을 초대하여 대화를 시작해요.",
                                    style: TextStyle(fontSize: 12)),
                              ],
                            )
                          ],
                        )),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 20),
                        child: ElevatedButton(
                            onPressed: () {
                              Get.to(() => Screen2());
                            },
                            style: ElevatedButton.styleFrom(
                                elevation: 4,
                                minimumSize:
                                    Size(size.width * 0.35, size.width * 0.45),
                                backgroundColor: const Color(0xffFFC542),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14))),
                            child: Column(
                              children: [
                                const Padding(
                                  padding: EdgeInsets.only(bottom: 12),
                                  child: Text(
                                    "대화 참여하기",
                                    style: TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 18),
                                  ),
                                ),
                                Image.asset(
                                    "assets/images/Groupdiscussion1.png")
                              ],
                            )),
                      ),
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 20),
                        child: ElevatedButton(
                            onPressed: () {
                              Get.to(() => Screen1());
                            },
                            style: ElevatedButton.styleFrom(
                                elevation: 4,
                                minimumSize:
                                    Size(size.width * 0.35, size.width * 0.45),
                                backgroundColor: const Color(0xff3ED598),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14))),
                            child: Column(
                              children: [
                                const Padding(
                                  padding: EdgeInsets.only(bottom: 12),
                                  child: Text(
                                    "기록 확인하기",
                                    style: TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 18),
                                  ),
                                ),
                                Image.asset("assets/images/folderman1.png")
                              ],
                            )),
                      ),
                    ],
                  )
                ]),
              )
            ],
          ),
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
