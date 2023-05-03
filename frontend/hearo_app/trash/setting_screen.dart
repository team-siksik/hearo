// import 'dart:math';
// import 'package:flutter/material.dart';
// import 'package:hearo_app/widgets/common/custom_app_bar_inner.dart';
// import 'package:animated_toggle_switch/animated_toggle_switch.dart';
// import 'package:hearo_app/widgets/mysettings/chat_preview.dart';
// import 'package:hearo_app/widgets/mysettings/dropdown_box.dart';
// import 'dart:async';

// class SettingScreen extends StatefulWidget {
//   const SettingScreen({super.key});

//   @override
//   State<SettingScreen> createState() => _SettingScreenState();
// }

// int value = 0;
// bool positive = false;
// bool loading = false;

// final List<String> items = [
//   'Item1',
//   'Item2',
//   'Item3',
//   'Item4',
//   'Item5',
//   'Item6',
//   'Item7',
//   'Item8',
// ];
// String? selectedValue;

// class _SettingScreenState extends State<SettingScreen> {
//   @override
//   Widget build(BuildContext context) {
//     Size size = MediaQuery.of(context).size;
//     return Scaffold(
//       appBar: CustomAppBarInner(name: "음성 설정"),
//       body: Padding(
//         padding: EdgeInsets.fromLTRB(20, 10, 20, 5),
//         child: Column(children: [
//           Flexible(
//               flex: 1,
//               child: Column(children: [
//                 Row(
//                   children: [
//                     Icon(Icons.text_fields_rounded, size: 30),
//                     Padding(
//                       padding: const EdgeInsets.only(left: 10),
//                       child: Text(
//                         "대화창 글자 크기 설정",
//                         style: TextStyle(fontSize: 20),
//                       ),
//                     )
//                   ],
//                 ),
//                 Padding(
//                   padding: const EdgeInsets.all(8.0),
//                   child: textToggle(),
//                 ),
//                 ChatPreview(
//                   size: size,
//                   textSize: value,
//                 ),
//               ])),
//           Flexible(
//               flex: 1,
//               child: Column(
//                 children: [
//                   Row(
//                     children: [
//                       Icon(Icons.record_voice_over_rounded, size: 30),
//                       Padding(
//                         padding: const EdgeInsets.only(left: 10),
//                         child: Text(
//                           "TTS 음성 설정",
//                           style: TextStyle(fontSize: 20),
//                         ),
//                       )
//                     ],
//                   ),
//                   Padding(
//                     padding: const EdgeInsets.all(15),
//                     child: Center(
//                       child: CustomDropdownButton2(
//                         buttonWidth: size.width * 0.6,
//                         dropdownWidth: size.width * 0.6,
//                         icon: Icon(Icons.arrow_drop_down_circle_outlined),
//                         iconSize: 20,
//                         hint: 'Select Item',
//                         dropdownItems: items,
//                         value: selectedValue,
//                         onChanged: (value1) {
//                           setState(() {
//                             selectedValue = value1;
//                           });
//                         },
//                       ),
//                     ),
//                   ),
//                 ],
//               )),
//         ]),
//       ),
//     );
//   }

//   AnimatedToggleSwitch<int> textToggle() {
//     return AnimatedToggleSwitch<int>.size(
//       current: value,
//       values: const [0, 1, 2],
//       iconOpacity: 0.2,
//       indicatorSize: const Size.fromWidth(110),
//       iconAnimationType: AnimationType.onHover,
//       indicatorAnimationType: AnimationType.onHover,
//       iconBuilder: (value, size) {
//         IconData data = Icons.format_color_text_rounded;
//         if (value == 0) {
//           return Row(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               Icon(
//                 data,
//                 size: min(size.width, size.height) * 0.7,
//               ),
//               Text(
//                 "작게",
//                 style: TextStyle(fontSize: 12),
//               )
//             ],
//           );
//         } else if (value == 1) {
//           return Row(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               Icon(
//                 data,
//                 size: min(size.width, size.height),
//               ),
//               Text(
//                 "중간",
//                 style: TextStyle(fontSize: 18),
//               )
//             ],
//           );
//         }
//         return Row(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             Icon(
//               data,
//               size: min(size.width, size.height) * 1.1,
//             ),
//             Text(
//               "크게",
//               style: TextStyle(fontSize: 24),
//             )
//           ],
//         );
//       },
//       borderWidth: 0.0,
//       borderColor: Colors.transparent,
//       colorBuilder: (i) => Color.fromARGB(255, 230, 137, 140),
//       onChanged: (i) async {
//         setState(
//           () {
//             value = i;
//           },
//         );
//         return Future.delayed(Duration(milliseconds: 700));
//       },
//     );
//   }
// }
