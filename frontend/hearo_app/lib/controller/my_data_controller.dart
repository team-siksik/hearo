import 'package:get/get.dart';

class MyDataController extends GetxController {
  List<String> sayings = [
    "안녕하세요",
    "반갑습니다.",
    "좋은 생각인 것 같아요!",
    "제가 해보겠습니다",
    "좋은 아침입니다!"
  ];
  // 말 추가
  void addSaying(saying) {
    sayings.add(saying);
    update();
  }

  // 말 제거
  void removeSaying(saying) {
    sayings.remove(saying);
    update();
  }

  // 말 편집
  void editSaying(before, after) async {
    var where = sayings.indexOf(before);
    sayings.remove(before);
    sayings.insert(where, after);
    update();
  }
}
