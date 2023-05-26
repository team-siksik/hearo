import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class LoginController extends GetxController {
  final loginToken = ''.obs;
  final loginData = [].obs;
  final myCode = '9983'.obs;
  final loginBox = GetStorage();
  final loginDataBox = GetStorage();

  @override
  void onInit() {
    super.onInit();

    if (loginBox.hasData('loginToken')) {
      final savedData = loginBox.read<String>('loginToken');
      if (savedData != null && savedData.isNotEmpty) {
        loginToken.value = savedData;
      }
    }
    if (loginDataBox.hasData('loginData')) {
      loginData.assignAll(loginDataBox.read<List>('loginData')!.cast<String>());
    }
  }

  void setMyCode(data) {
    myCode.value = data;
  }

  void setData(data) {
    loginData.add(data);
    update();
  }

  // 토큰 비우기
  void clearList() async {
    loginToken.value = ''; // loginToken을 빈 문자열로 초기화
    myCode.value = '';
    await loginBox.remove('loginToken');
    loginData.clear();
    await loginDataBox.remove('loginData');
    update();
  }
}
