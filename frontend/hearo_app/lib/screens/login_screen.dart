import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:hearo_app/apis/login_api.dart';
import 'package:hearo_app/screens/choose_mode_screen.dart';
import 'package:get/get.dart';
import 'package:hearo_app/test/socket_test.dart';
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
                  // showSuccessModal(context, size);
                  Get.to(() => SocketTest());
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
      print(credential.accessToken);
      // Once signed in, return the UserCredential
      final data = sendToken(context, size, credential.accessToken);
      return data;
    } catch (e) {
      print(e);
    }
  }

  Future sendToken(context, size, data) async {
    // accessToken 값을 전달하고, sendAccessTokenToBackend 함수를 호출합니다.
    final accessToken = data;
    final flag = await ApiLog.loginApi(accessToken);
    if (flag == true) {
      Get.to(() => ChooseModeScreen());
    }
  }
}
