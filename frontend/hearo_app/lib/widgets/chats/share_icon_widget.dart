import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';

class ShareIconWidget extends StatelessWidget {
  const ShareIconWidget({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(Icons.share_outlined),
      onPressed: () => showDialog(
        context: context,
        builder: (BuildContext context) => AlertDialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text(
            '공유 코드',
            textAlign: TextAlign.center,
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          content: const Text(
            '8 0 3 4 6 1',
            style: TextStyle(fontSize: 30, fontWeight: FontWeight.w700),
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
                      shape: MaterialStatePropertyAll(RoundedRectangleBorder(
                          side:
                              BorderSide(color: Color(0xffE63E43), width: 1.5),
                          borderRadius:
                              BorderRadius.all(Radius.circular(30))))),
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: '803461'));
                    Get.snackbar(
                        "클립보드에 복사되었습니다.", "https://hear-o.co.kr/803461",
                        duration: Duration(seconds: 2),
                        snackPosition: SnackPosition.BOTTOM,
                        backgroundColor: Colors.white54,
                        margin: EdgeInsets.only(bottom: 10));
                  },
                  child: const Text(
                    '초대링크복사',
                    style: TextStyle(color: Colors.black),
                  ),
                ),
                ElevatedButton(
                  style: ButtonStyle(
                      backgroundColor:
                          MaterialStatePropertyAll(Color(0xffe63e43)),
                      shape: MaterialStatePropertyAll(RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.all(Radius.circular(30))))),
                  onPressed: () {
                    Get.back();
                  },
                  child: const Text(
                    '돌아가기',
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
