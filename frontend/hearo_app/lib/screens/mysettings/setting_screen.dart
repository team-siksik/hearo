import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/widgets/common/custom_app_bar_inner.dart';
import 'package:hearo_app/widgets/mysettings/dropdown_box.dart';

class SettingScreen extends StatefulWidget {
  const SettingScreen({super.key});

  @override
  State<SettingScreen> createState() => _SettingScreenState();
}

int value = 0;
bool positive = false;
bool loading = false;

final List<String> items = [
  '여성(nayeon)',
  '남성(dominic)',
  '여성(hanna)',
  '남성(ray)',
  '여성(hyeonjeong)',
  '여성(jini)',
  '남성(eric)',
  '여성(mark)',
];
String? selectedValue;

class _SettingScreenState extends State<SettingScreen> {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: CustomAppBarInner(name: "음성 설정"),
      body: Padding(
        padding: EdgeInsets.fromLTRB(20, 10, 20, 5),
        child: Column(children: [
          Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(5),
                child: Row(
                  children: [
                    Icon(Icons.record_voice_over_rounded, size: 30),
                    Padding(
                      padding: const EdgeInsets.only(left: 10),
                      child: Text(
                        "TTS 음성 설정",
                        style: TextStyle(fontSize: 20),
                      ),
                    )
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(15),
                child: Center(
                  child: CustomDropdownButton2(
                    buttonWidth: size.width * 0.8,
                    dropdownWidth: size.width * 0.8,
                    icon: Icon(Icons.arrow_drop_down_circle_outlined),
                    iconSize: 20,
                    hint: '여성(Jane)',
                    dropdownItems: items,
                    value: selectedValue,
                    onChanged: (value1) {
                      setState(() {
                        selectedValue = value1;
                      });
                    },
                  ),
                ),
              ),
              TextButton(
                  onPressed: () => showDialog(
                        context: context,
                        builder: (BuildContext context) => AlertDialog(
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20)),
                          title: const Text(
                            '음성 변경',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          content: const Text(
                            '음성을 변경 하시겠습니까?',
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
                                    '취소',
                                    style: TextStyle(color: Colors.black38),
                                  ),
                                ),
                                ElevatedButton(
                                  style: ButtonStyle(
                                      backgroundColor: MaterialStatePropertyAll(
                                          Color(0xff3ED598)),
                                      shape: MaterialStatePropertyAll(
                                          RoundedRectangleBorder(
                                              borderRadius: BorderRadius.all(
                                                  Radius.circular(30))))),
                                  onPressed: () {
                                    Get.back();
                                  },
                                  child: const Text(
                                    '변경',
                                  ),
                                ),
                              ],
                            )
                          ],
                        ),
                      ),
                  child: Padding(
                    padding: const EdgeInsets.only(right: 15),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Container(
                          height: 40,
                          width: size.width * 0.2,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(14),
                            color: Color(0xff3ED598),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.transparent.withOpacity(0.25),
                                spreadRadius: 0,
                                blurRadius: 1.0,
                                offset: const Offset(
                                    0, 2), // changes position of shadow
                              ),
                            ],
                          ),
                          child: Center(
                              child: Text("저장",
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 18,
                                      fontWeight: FontWeight.w600))),
                        ),
                      ],
                    ),
                  )),
            ],
          ),
        ]),
      ),
    );
  }
}
