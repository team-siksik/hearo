import 'package:flutter/material.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: Container(
        width: size.width,
        padding: const EdgeInsets.only(top: 100, left: 15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Image.asset("assets/images/hearo1.png"),
            const Column(
              children: [
                SizedBox(
                  height: 30,
                ),
                Text(
                  "히어로",
                  style: TextStyle(fontSize: 40, fontWeight: FontWeight.w600),
                ),
                SizedBox(
                  height: 40,
                ),
                Text(
                  "반갑습니다!",
                  style: TextStyle(fontSize: 20),
                ),
                Text(
                  "히어로에 오신 것을 환영해요",
                  style: TextStyle(fontSize: 20),
                ),
                SizedBox(
                  height: 40,
                ),
              ],
            ),
            GestureDetector(
              onTap: () {
                showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return Dialog(
                        shape: const RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.all(Radius.circular(20))),
                        child: SizedBox(
                            height: size.width * 0.55,
                            width: size.width * 0.8,
                            child: Padding(
                              padding: const EdgeInsets.only(
                                  top: 30, bottom: 30, left: 20, right: 20),
                              child: Column(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    "히어로에 오신 것을 환영합니다.",
                                    style: TextStyle(
                                        fontSize: 24,
                                        fontWeight: FontWeight.w700),
                                  ),
                                  const Column(
                                    children: [
                                      SizedBox(
                                        height: 20,
                                      ),
                                      Text(
                                        "상대를 초대해서",
                                        style: TextStyle(
                                          fontSize: 20,
                                        ),
                                      ),
                                      Text(
                                        "대화를 시작해 보세요!",
                                        style: TextStyle(
                                          fontSize: 20,
                                        ),
                                      ),
                                    ],
                                  ),
                                  SizedBox(
                                    width: 250,
                                    child: ElevatedButton(
                                        style: const ButtonStyle(
                                            iconSize:
                                                MaterialStatePropertyAll(20),
                                            backgroundColor:
                                                MaterialStatePropertyAll(
                                                    Color.fromARGB(
                                                        255, 127, 206, 255)),
                                            shape: MaterialStatePropertyAll(
                                                RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.all(
                                                            Radius.circular(
                                                                10))))),
                                        onPressed: () {},
                                        child: const Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
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
              },
              child: Container(
                decoration: BoxDecoration(
                    border: Border.all(
                      color: const Color(0xffEEEEEE),
                    ),
                    borderRadius: const BorderRadius.all(Radius.circular(24))),
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
            )
          ],
        ),
      ),
    );
  }
}
