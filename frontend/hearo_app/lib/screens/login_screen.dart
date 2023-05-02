import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:hearo_app/apis/login_api.dart';
import 'package:hearo_app/screens/home_screen.dart';
import 'package:get/get.dart';
import 'package:permission_handler/permission_handler.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

getPermissionAudio() async {
  var statusMicrophone = await Permission.microphone.status;
  if (statusMicrophone.isGranted) {
    print('허락됨2microphone');
  } else if (statusMicrophone.isDenied) {
    print('거절됨2microphone');
    Permission.microphone.request();
  }
}

class _LoginScreenState extends State<LoginScreen> {
  @override
  void initState() {
    super.initState();
    // getPermissionCamera();
    getPermissionAudio();
    // getPermission();
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: Container(
        width: size.width,
        padding: const EdgeInsets.only(top: 120, left: 15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            GestureDetector(
                onTap: () {
                  showSuccessModal(context, size);
                },
                child: SizedBox(
                    height: size.width * 0.6,
                    width: size.width * 0.6,
                    child: Image.asset("assets/images/hearo_logo_circle.png",
                        fit: BoxFit.fill))),
            Column(
              children: [
                SizedBox(
                  height: 30,
                ),
                Image.asset("assets/images/hearo_text_login.png"),
                SizedBox(
                  height: 40,
                ),
                SizedBox(
                  height: 40,
                ),
              ],
            ),
            GestureDetector(
              onTap: () => loginWithGoogle(context, size),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: const BorderRadius.all(Radius.circular(24)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.transparent.withOpacity(0.25),
                      spreadRadius: 0,
                      blurRadius: 1.0,
                      offset: const Offset(0, 2), // changes position of shadow
                    ),
                  ],
                ),
                width: 300,
                padding: const EdgeInsets.only(
                    left: 30, top: 6, bottom: 6, right: 30),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    SizedBox(
                      width: 50,
                      height: 50,
                      child: Image.asset("assets/images/googlelogo1.png"),
                    ),
                    const Text(
                      "구글아이디로 로그인",
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
                    )
                  ],
                ),
              ),
            ),
            // welcomeModal(context, size)
          ],
        ),
      ),
    );
  }

  // 환영 모달
  void showSuccessModal(BuildContext context, Size size) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return Dialog(
            shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(20))),
            child: SizedBox(
                height: size.width * 0.55,
                width: size.width * 0.8,
                child: Padding(
                  padding: const EdgeInsets.only(
                      top: 30, bottom: 30, left: 20, right: 20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "히어로에 오신 것을 환영합니다.",
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                            fontSize: 22, fontWeight: FontWeight.w700),
                      ),
                      const Column(
                        children: [
                          SizedBox(
                            height: 20,
                          ),
                          Text(
                            "상대를 초대해서",
                            style: TextStyle(
                              fontSize: 18,
                            ),
                          ),
                          Text(
                            "대화를 시작해 보세요!",
                            style: TextStyle(
                              fontSize: 18,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(
                        width: 250,
                        child: ElevatedButton(
                            style: const ButtonStyle(
                                iconSize: MaterialStatePropertyAll(20),
                                backgroundColor:
                                    MaterialStatePropertyAll(Color(0xffe63e43)),
                                shape: MaterialStatePropertyAll(
                                    RoundedRectangleBorder(
                                        borderRadius: BorderRadius.all(
                                            Radius.circular(10))))),
                            onPressed: () {
                              Get.to(() => HomeScreen());
                            },
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  "시작하기",
                                  style: TextStyle(fontSize: 20),
                                ),
                                SizedBox(
                                  width: 20,
                                ),
                                Icon(Icons.arrow_forward)
                              ],
                            )),
                      )
                    ],
                  ),
                )),
          );
        });
  }

  loginWithGoogle(context, size) async {
    // Trigger the authentication flow
    final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();

    // Obtain the auth details from the request
    final GoogleSignInAuthentication? googleAuth =
        await googleUser?.authentication;

    // Create a new credential
    try {
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth?.accessToken,
        idToken: googleAuth?.idToken,
      );
      print(credential);
      // Once signed in, return the UserCredential
      final data = sendToken(context, size, credential.accessToken);
      return data;
    } catch (e) {
      print(e);
      print('에러에러에러에러에러에러에러에러에러');
    }
  }

  Future sendToken(context, size, data) async {
    // accessToken 값을 전달하고, sendAccessTokenToBackend 함수를 호출합니다.
    final accessToken = data;
    final flag = await ApiLog.loginApi(accessToken);
    if (flag == true) {
      showSuccessModal(context, size);
    }
  }
}
