import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/screens/home_screen.dart';

class CloseChat extends StatelessWidget {
  const CloseChat({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return TextButton(
      onPressed: () => showDialog(
        context: context,
        builder: (BuildContext context) => AlertDialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text(
            '대화 종료',
            textAlign: TextAlign.center,
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          content: SizedBox(
            height: size.height * 0.1,
            child: Column(
              children: [
                Text(
                  '대화를 저장하고',
                  style: TextStyle(fontSize: 20),
                  textAlign: TextAlign.center,
                ),
                Text(
                  '종료하시겠습니까?',
                  style: TextStyle(fontSize: 20),
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
                      shape: MaterialStatePropertyAll(RoundedRectangleBorder(
                          side:
                              BorderSide(color: Color(0xffE63E43), width: 1.5),
                          borderRadius:
                              BorderRadius.all(Radius.circular(30))))),
                  onPressed: () {
                    Get.back();
                  },
                  child: const Text(
                    '돌아가기',
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
                    Get.offAll(() => HomeScreen());
                  },
                  child: const Text(
                    '저장 후 종료',
                  ),
                ),
              ],
            )
          ],
        ),
      ),
      child: Text(
        "대화 종료",
        style: TextStyle(color: Color(0xffe63e43)),
      ),
    );
  }
}
