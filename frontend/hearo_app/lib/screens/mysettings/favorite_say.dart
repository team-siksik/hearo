import 'package:flutter/material.dart';
import 'package:hearo_app/widgets/common/custom_app_bar_inner.dart';
import 'package:get/get.dart';

class FavoriteSay extends StatelessWidget {
  const FavoriteSay({super.key});

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.sizeOf(context);
    return Scaffold(
      appBar: CustomAppBarInner(name: "자주 쓰는 말"),
      // scaffold에서 키보드 밀림 방지
      resizeToAvoidBottomInset: false,
      body: SizedBox(
        width: size.width,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "5 / 10",
                    style: TextStyle(fontSize: 18),
                  ),
                  TextButton(
                      onPressed: () => showDialog(
                            context: context,
                            builder: (BuildContext context) => AlertDialog(
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20)),
                              title: Text(
                                '자주 쓰는 말 추가',
                                textAlign: TextAlign.center,
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              content: SizedBox(
                                width: size.width * 0.55,
                                child: TextField(
                                  maxLines: 5,
                                  //  controller: _textController,
                                  //  onSubmitted: sendMsg,  //키보드로 엔터 클릭 시 호출
                                  //  onChanged: checkText,  //text 가 입력될 때 마다 호출
                                  decoration: InputDecoration(
                                    // labelText: '텍스트 입력',
                                    hintText: '자주쓰는 말을 입력해주세요',
                                    focusedBorder: OutlineInputBorder(
                                        borderSide: BorderSide(
                                            color: Color(0xff3ED598)),
                                        borderRadius:
                                            BorderRadius.circular(14)), //외곽선
                                    enabledBorder: OutlineInputBorder(
                                        borderSide:
                                            BorderSide(color: Colors.black26),
                                        borderRadius:
                                            BorderRadius.circular(14)), //외곽선
                                  ),
                                ),
                              ),
                              // SizedBox(
                              //     height: size.height * 0.2,
                              //     child: Container(
                              //       decoration: BoxDecoration(
                              //           border:
                              //               Border.all(color: Colors.black26),
                              //           borderRadius:
                              //               BorderRadius.circular(14)),
                              //     )),
                              actions: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceEvenly,
                                  children: [
                                    ElevatedButton(
                                      style: ButtonStyle(
                                          backgroundColor:
                                              MaterialStatePropertyAll(
                                                  Color.fromARGB(
                                                      255, 255, 255, 255)),
                                          shape: MaterialStatePropertyAll(
                                              RoundedRectangleBorder(
                                                  side: BorderSide(
                                                      color: Colors.black38),
                                                  borderRadius:
                                                      BorderRadius.all(
                                                          Radius.circular(
                                                              30))))),
                                      onPressed: () {
                                        Get.back();
                                      },
                                      child: Text(
                                        '돌아가기',
                                        style: TextStyle(color: Colors.black38),
                                      ),
                                    ),
                                    ElevatedButton(
                                      style: ButtonStyle(
                                          backgroundColor:
                                              MaterialStatePropertyAll(
                                                  Color(0xff3ED598)),
                                          shape: MaterialStatePropertyAll(
                                              RoundedRectangleBorder(
                                                  borderRadius:
                                                      BorderRadius.all(
                                                          Radius.circular(
                                                              30))))),
                                      onPressed: () {
                                        // 투두: 여기다가 추가 함수 넣어야 함
                                        Get.back();
                                      },
                                      child: const Text(
                                        '추가하기',
                                      ),
                                    ),
                                  ],
                                )
                              ],
                            ),
                          ),
                      child: Text(
                        "추가",
                        style:
                            TextStyle(color: Color(0xff3ED598), fontSize: 18),
                      ))
                ],
              ),
            ),
            SizedBox(
              height: size.height * 0.8,
              child: ListView(
                children: [
                  favoriteSay(context, "안녕하세요, 저는 청각장애인입니다."),
                  favoriteSay(context, "감사합니다!"),
                  favoriteSay(context, "안녕하세요, 저는 청각장애인입니다."),
                  favoriteSay(context, "감사합니다!"),
                  favoriteSay(context, "안녕하세요, 저는 청각장애인입니다."),
                  favoriteSay(context, "감사합니다!"),
                  favoriteSay(context, "안녕하세요, 저는 청각장애인입니다."),
                  favoriteSay(context, "감사합니다!"),
                  favoriteSay(context, "안녕하세요, 저는 청각장애인입니다."),
                  favoriteSay(context, "감사합니다!"),
                  favoriteSay(context, "안녕하세요, 저는 청각장애인입니다."),
                  favoriteSay(context, "감사합니다!"),
                  favoriteSay(context, "안녕하세요, 저는 청각장애인입니다."),
                  favoriteSay(context, "감사합니다!"),
                  favoriteSay(context, "안녕하세요, 저는 청각장애인입니다."),
                  favoriteSay(context, "감사합니다!"),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Container favoriteSay(BuildContext context, saying) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Container(
        decoration: BoxDecoration(
            border:
                BorderDirectional(bottom: BorderSide(color: Colors.black26))),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              saying,
              style: TextStyle(fontSize: 16),
            ),
            sayDelete(context)
          ],
        ),
      ),
    );
  }

  // 자주 쓰는 말 삭제 아이콘 버튼
  IconButton sayDelete(BuildContext context) {
    return IconButton(
        color: Color(0xffE63E43),
        onPressed: () => showDialog(
              context: context,
              builder: (BuildContext context) => AlertDialog(
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20)),
                title: const Text(
                  '자주 쓰는 말 삭제',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                content: Text(
                  '자주 쓰는 말을 삭제 하시겠습니까?',
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
                                    side: BorderSide(color: Colors.black38),
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
                            backgroundColor:
                                MaterialStatePropertyAll(Color(0xffe63e43)),
                            shape: MaterialStatePropertyAll(
                                RoundedRectangleBorder(
                                    borderRadius: BorderRadius.all(
                                        Radius.circular(30))))),
                        onPressed: () {
                          Get.back();
                        },
                        child: const Text(
                          '삭제하기',
                        ),
                      ),
                    ],
                  )
                ],
              ),
            ),
        icon: Icon(Icons.close_rounded));
  }
}
