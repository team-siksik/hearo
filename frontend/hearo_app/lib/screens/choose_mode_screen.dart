import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/login_controller.dart';
import 'package:hearo_app/screens/glasses/blue_search.dart';
import 'package:hearo_app/screens/home_screen.dart';
import 'package:permission_handler/permission_handler.dart';

class ChooseModeScreen extends StatefulWidget {
  const ChooseModeScreen({super.key});

  @override
  State<ChooseModeScreen> createState() => _ChooseModeScreenState();
}

class _ChooseModeScreenState extends State<ChooseModeScreen> {
  LoginController loginController = Get.put(LoginController());

  @override
  void initState() {
    super.initState();
    getPermissionCamera();
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

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.sizeOf(context);
    return WillPopScope(
        onWillPop: () async {
          return false;
        },
        child: Scaffold(
          body: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // 안녕하세요 ~ 환영해요 부분
              SizedBox(
                width: size.width,
                child: Padding(
                  padding: EdgeInsets.fromLTRB(20, 0, 0, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        "안녕하세요, ${loginController.loginData[0]["nickname"]}님",
                        style: TextStyle(
                            fontSize: 24, fontWeight: FontWeight.w600),
                      ),
                      Padding(
                        padding: EdgeInsets.fromLTRB(0, 5, 0, 0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "히어로",
                              style: TextStyle(
                                  fontSize: 20,
                                  color: Color(0xff1A73E8),
                                  fontWeight: FontWeight.w600),
                            ),
                            Text(
                              "에 오신 것을 환영해요.",
                              style: TextStyle(fontSize: 16),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              startWidgetButton(size, "mobile"),
              startWidgetButton(size, "glass")
            ],
          ),
        ));
  }

  SizedBox startWidgetButton(Size size, String where) {
    Map info = {
      "mobile": [
        "Hearo - Mobile",
        "assets/images/phone.png",
        "안경없이 시작하기",
      ],
      "glass": [
        "Hearo - Glass",
        "assets/images/glasses.png",
        "H - Glass 시작하기",
      ],
    };
    return SizedBox(
      width: size.width * 0.7,
      height: size.width * 0.7,
      child: ElevatedButton(
        onPressed: () {
          if (where == "glass") {
            Get.to(() => BlueSearch());
          } else {
            Get.offAll(() => HomeScreen());
          }
        },
        style: ElevatedButton.styleFrom(
          foregroundColor: Colors.lightBlue[300],
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30.0),
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Text(
              info[where][0],
              style: TextStyle(
                color: Color(0xff1A73E8),
                fontSize: 26,
              ),
            ),
            SizedBox(
              height: size.width * 0.4,
              width: size.width * 0.4,
              child: Image.asset(
                info[where][1],
                fit: BoxFit.fill,
              ),
            ),
            Container(
              decoration: BoxDecoration(
                  color: Color(0xff1A73E8),
                  borderRadius: BorderRadius.circular(15)),
              padding: EdgeInsets.symmetric(vertical: 10, horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    info[where][2],
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(left: 4, top: 2),
                    child: Icon(
                      Icons.arrow_circle_right_outlined,
                      color: Colors.white,
                    ),
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
