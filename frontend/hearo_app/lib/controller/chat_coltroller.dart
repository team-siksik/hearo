import 'package:get/get.dart';

class ChatController extends GetxController {
  String inputSay = '';

  // 말 변경
  void changeSaying(what) {
    inputSay = what;
    update();
  }
}
