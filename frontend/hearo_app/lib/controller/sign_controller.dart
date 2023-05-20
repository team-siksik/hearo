import 'package:get/get.dart';

class SignContoller extends GetxController {
  Rx<List> signs = Rx([]);

  @override
  void onInit() async {
    super.onInit();
    signs.value = [];
  }

  void addSigns(data) {
    if (!signs.value.contains(data)) {
      print("@@@@999999999999999999999999999999999999999$data");
      signs.value.add(data);
    }
  }

  void clearSigns() {
    signs.value.clear();
  }
}
