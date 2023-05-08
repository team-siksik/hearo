import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:hearo_app/apis/say_api.dart';
import 'package:hearo_app/controller/login_controller.dart';

LoginController loginController = Get.put(LoginController());

class MyDataController extends GetxController {
  final sayings = [].obs;
  final box = GetStorage();

  @override
  void onInit() async {
    super.onInit();
    print("온잇잇");
    final data = await ApiSay.sayGetApi();
    if (data != null) {
      sayings
          .assignAll(data.map<String>((e) => e['sentence'] as String).toList());
      box.write('sayings', data);
    } else {
      sayings.assignAll(box.read<List>('sayings')?.cast<String>() ?? []);
    }
  }

  // 말 추가
  void addSaying(saying) {
    sayings.add(saying);
    ApiSay.sayCreateApi(saying);
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
    sayings[where];
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
