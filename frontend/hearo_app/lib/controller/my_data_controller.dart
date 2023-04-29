import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class MyDataController extends GetxController {
  final sayings = [].obs;

  final box = GetStorage();

  @override
  void onInit() {
    super.onInit();
    if (box.hasData('sayings')) {
      sayings.assignAll(box.read<List>('sayings')!.cast<String>());
    }
  }

  // 말 추가
  void addSaying(saying) {
    sayings.add(saying);
    box.write('sayings', sayings.toList());
    update();
  }

  // 말 제거
  void removeSaying(saying) {
    sayings.remove(saying);
    box.write('sayings', sayings.toList());
    update();
  }

  // 말 편집
  void editSaying(before, after) async {
    var where = sayings.indexOf(before);
    sayings.remove(before);
    sayings.insert(where, after);
    box.write('sayings', sayings.toList());
    update();
  }

  // 리스트 비우기
  void clearList() {
    sayings.clear();
    box.remove('sayings');
    update();
  }
}
