import 'package:flutter/material.dart';
import 'package:hearo_app/widgets/common/custom_app_bar_inner.dart';

class SettingHome extends StatelessWidget {
  const SettingHome({super.key});

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: CustomAppBarInner(name: "내 정보"),
      body: Container(
        margin: EdgeInsets.only(top: 30),
        width: size.width,
        child: Column(mainAxisAlignment: MainAxisAlignment.start, children: [
          Text(
            "김나연",
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
          ),
          Container(
              padding: EdgeInsets.only(top: 10, bottom: 25),
              child: Text("kimnaboog12@gmail.com",
                  style: TextStyle(fontSize: 16))),
          Container(
            width: size.width * 0.9,
            padding: EdgeInsets.symmetric(vertical: 22),
            decoration: BoxDecoration(
                border:
                    Border(top: BorderSide(color: Colors.black12, width: 1))),
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
                                fontSize: 20, fontWeight: FontWeight.w600)),
                      )
                    ],
                  ),
                  Icon(Icons.arrow_forward_ios_rounded)
                ],
              ),
            ),
          ),
          Container(
            width: size.width * 0.9,
            padding: EdgeInsets.symmetric(vertical: 22),
            decoration: BoxDecoration(
                border:
                    Border(top: BorderSide(color: Colors.black12, width: 1))),
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
                        child: Text("환경 설정",
                            style: TextStyle(
                                fontSize: 20, fontWeight: FontWeight.w600)),
                      )
                    ],
                  ),
                  Icon(Icons.arrow_forward_ios_rounded)
                ],
              ),
            ),
          ),
          Container(
            width: size.width * 0.9,
            padding: EdgeInsets.symmetric(vertical: 22),
            decoration: BoxDecoration(
                border:
                    Border(top: BorderSide(color: Colors.black12, width: 1))),
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
                                fontSize: 20, fontWeight: FontWeight.w600)),
                      )
                    ],
                  ),
                  Icon(Icons.arrow_forward_ios_rounded)
                ],
              ),
            ),
          ),
          Container(
            width: size.width * 0.9,
            padding: EdgeInsets.symmetric(vertical: 22),
            decoration: BoxDecoration(
                border:
                    Border(top: BorderSide(color: Colors.black12, width: 1))),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 70),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // TODO : 컨펌 달기
                  GestureDetector(
                    onTap: () {},
                    child: Text(
                      "로그아웃",
                      style: TextStyle(
                          color: Color(0xffe63e43),
                          fontSize: 20,
                          fontWeight: FontWeight.w500),
                    ),
                  ),
                  GestureDetector(
                    onTap: () {},
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
