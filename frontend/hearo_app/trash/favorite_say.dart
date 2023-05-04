// import 'package:flutter/material.dart';
// import 'package:hearo_app/controller/my_data_controller.dart';
// import 'package:hearo_app/widgets/common/custom_app_bar_inner.dart';
// import 'package:get/get.dart';
// import 'package:auto_size_text/auto_size_text.dart';

// class FavoriteSay extends StatefulWidget {
//   const FavoriteSay({super.key});

//   @override
//   State<FavoriteSay> createState() => _FavoriteSayState();
// }

// class _FavoriteSayState extends State<FavoriteSay> {
//   String inputText = '';
//   int sss = 0;
//   MyDataController myDataController = Get.put(MyDataController());
//   TextEditingController textController = TextEditingController();

//   @override
//   void initState() {
//     super.initState();

//     sss = myDataController.sayings.length;
//   }

//   @override
//   Widget build(BuildContext context) {
//     Size size = MediaQuery.sizeOf(context);

//     return Scaffold(
//       appBar: CustomAppBarInner(name: "자주 쓰는 말"),
//       // scaffold에서 키보드 밀림 방지
//       resizeToAvoidBottomInset: false,
//       body: SizedBox(
//         width: size.width,
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.center,
//           children: [
//             Padding(
//               padding: const EdgeInsets.only(left: 20),
//               child: Row(
//                 mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                 children: [
//                   myDataController.sayings.length < 10
//                       ? Text(
//                           "$sss / 10",
//                           style: TextStyle(fontSize: 18),
//                         )
//                       : Text(
//                           "$sss / 10",
//                           style:
//                               TextStyle(fontSize: 18, color: Color(0xffe63e43)),
//                         ),
//                   myDataController.sayings.length < 10
//                       ? TextButton(
//                           onPressed: () {
//                             setState(() {
//                               textController.text = '';
//                             });
//                             if (myDataController.sayings.length < 10) {
//                               sayingDialog(context, size, false, '');
//                             }
//                           },
//                           child: Text(
//                             "추가",
//                             style: TextStyle(
//                                 color: Color(0xff3ED598), fontSize: 18),
//                           ))
//                       : SizedBox(
//                           height: 40,
//                         )
//                 ],
//               ),
//             ),
//             SizedBox(
//                 height: size.height * 0.8,
//                 child: Obx(
//                   () => ListView.builder(
//                     itemCount: myDataController.sayings.length,
//                     itemBuilder: (context, index) {
//                       var saying = myDataController.sayings[index];
//                       return favoriteSay(context, size, saying);
//                     },
//                   ),
//                 ))
//           ],
//         ),
//       ),
//     );
//   }

//   Future<dynamic> sayingDialog(
//       BuildContext context, Size size, bool edit, String say) {
//     setState(() {
//       if (edit) {
//         textController.text = say;
//         inputText = say;
//       } else {
//         textController.text = '';
//         inputText = '';
//       }
//     });

//     return showDialog(
//       context: context,
//       builder: (BuildContext context) => AlertDialog(
//         shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
//         title: Text(
//           edit ? '자주 쓰는 말 변경' : '자주 쓰는 말 추가',
//           textAlign: TextAlign.center,
//           style: TextStyle(fontWeight: FontWeight.bold),
//         ),
//         content: SizedBox(
//           width: size.width * 0.55,
//           child: TextField(
//             maxLines: 5,
//             maxLength: 50,
//             controller: textController,
//             //  onSubmitted: sendMsg,  //키보드로 엔터 클릭 시 호출
//             onChanged: (text) {
//               inputText = text;
//             }, //text 가 입력될 때 마다 호출
//             decoration: InputDecoration(
//               // labelText: '텍스트 입력',
//               hintText: '자주쓰는 말을 입력해주세요',
//               focusedBorder: OutlineInputBorder(
//                   borderSide: BorderSide(color: Color(0xff3ED598)),
//                   borderRadius: BorderRadius.circular(14)), //외곽선
//               enabledBorder: OutlineInputBorder(
//                   borderSide: BorderSide(color: Colors.black26),
//                   borderRadius: BorderRadius.circular(14)), //외곽선
//             ),
//           ),
//         ),
//         actions: [
//           Row(
//             mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//             children: [
//               ElevatedButton(
//                 style: ButtonStyle(
//                     backgroundColor: MaterialStatePropertyAll(
//                         Color.fromARGB(255, 255, 255, 255)),
//                     shape: MaterialStatePropertyAll(RoundedRectangleBorder(
//                         side: BorderSide(color: Colors.black38),
//                         borderRadius: BorderRadius.all(Radius.circular(30))))),
//                 onPressed: () {
//                   Get.back();
//                 },
//                 child: Text(
//                   '돌아가기',
//                   style: TextStyle(color: Colors.black38),
//                 ),
//               ),
//               ElevatedButton(
//                 style: ButtonStyle(
//                     backgroundColor:
//                         MaterialStatePropertyAll(Color(0xff3ED598)),
//                     shape: MaterialStatePropertyAll(RoundedRectangleBorder(
//                         borderRadius: BorderRadius.all(Radius.circular(30))))),
//                 onPressed: () async {
//                   if (inputText.trim().isEmpty ||
//                       myDataController.sayings.contains(inputText.trim())) {
//                     var duple =
//                         inputText.trim().isEmpty ? "입력된 말이 없어요" : "중복된 말입니다.";
//                     Get.snackbar(duple, say,
//                         duration: Duration(seconds: 1),
//                         snackPosition: SnackPosition.BOTTOM,
//                         backgroundColor:
//                             const Color.fromARGB(137, 255, 114, 114),
//                         margin: EdgeInsets.only(bottom: 10));

//                     return;
//                   }
//                   setState(() {
//                     if (edit) {
//                       myDataController.editSaying(say, inputText.trim());
//                     } else {
//                       myDataController.addSaying(inputText.trim());
//                     }

//                     textController.text = '';
//                     inputText = '';
//                   });
//                   Get.back();
//                 },
//                 child: edit ? Text('변경하기') : Text('추가하기'),
//               ),
//             ],
//           )
//         ],
//       ),
//     );
//   }

//   GestureDetector favoriteSay(BuildContext context, Size size, saying) {
//     return GestureDetector(
//       onTap: () {
//         sayingDialog(context, size, true, saying);
//       },
//       child: Container(
//         padding: const EdgeInsets.symmetric(horizontal: 20),
//         child: Container(
//           decoration: BoxDecoration(
//               border:
//                   BorderDirectional(bottom: BorderSide(color: Colors.black26))),
//           child: Row(
//             mainAxisAlignment: MainAxisAlignment.spaceBetween,
//             children: [
//               Flexible(
//                 flex: 8,
//                 child: AutoSizeText(
//                   saying,
//                   style: TextStyle(fontSize: 16),
//                   maxLines: 2,
//                 ),
//               ),
//               Flexible(flex: 1, child: sayDelete(context, saying))
//             ],
//           ),
//         ),
//       ),
//     );
//   }

//   // 자주 쓰는 말 삭제 아이콘 버튼
//   IconButton sayDelete(BuildContext context, saying) {
//     return IconButton(
//         color: Color(0xffE63E43),
//         onPressed: () => showDialog(
//               context: context,
//               builder: (BuildContext context) => AlertDialog(
//                 shape: RoundedRectangleBorder(
//                     borderRadius: BorderRadius.circular(20)),
//                 title: const Text(
//                   '자주 쓰는 말 삭제',
//                   textAlign: TextAlign.center,
//                   style: TextStyle(fontWeight: FontWeight.bold),
//                 ),
//                 content: Text(
//                   '"$saying" 을 삭제 하시겠습니까?',
//                   textAlign: TextAlign.center,
//                 ),
//                 actions: [
//                   Row(
//                     mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//                     children: [
//                       ElevatedButton(
//                         style: ButtonStyle(
//                             backgroundColor: MaterialStatePropertyAll(
//                                 Color.fromARGB(255, 255, 255, 255)),
//                             shape: MaterialStatePropertyAll(
//                                 RoundedRectangleBorder(
//                                     side: BorderSide(color: Colors.black38),
//                                     borderRadius: BorderRadius.all(
//                                         Radius.circular(30))))),
//                         onPressed: () {
//                           Get.back();
//                         },
//                         child: const Text(
//                           '돌아가기',
//                           style: TextStyle(color: Colors.black38),
//                         ),
//                       ),
//                       ElevatedButton(
//                         style: ButtonStyle(
//                             backgroundColor:
//                                 MaterialStatePropertyAll(Color(0xffe63e43)),
//                             shape: MaterialStatePropertyAll(
//                                 RoundedRectangleBorder(
//                                     borderRadius: BorderRadius.all(
//                                         Radius.circular(30))))),
//                         onPressed: () {
//                           setState(() {
//                             myDataController.removeSaying(saying);
//                             Get.back();
//                           });
//                         },
//                         child: const Text(
//                           '삭제하기',
//                         ),
//                       ),
//                     ],
//                   )
//                 ],
//               ),
//             ),
//         icon: Icon(Icons.close_rounded));
//   }
// }
