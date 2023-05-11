import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:get/get.dart';
import 'package:hearo_app/controller/login_controller.dart';

LoginController loginController = Get.put(LoginController());
// const base = 'http://10.0.2.2:8080/api/v1/profile/frequent';
// const base = 'http://k8a603.p.ssafy.io:8090/run/generate';
const base = 'http://k8a6031.p.ssafy.io:8090/api/v1/tg/generate';

class ApiGpt {
  static Future sayCreateApi(sentence) async {
    final response = await http.post(
      Uri.parse(base),
      body: {"text": sentence},
    );
    if (response.statusCode == 200) {
      final responseData = jsonDecode(utf8.decode(response.bodyBytes));
      print("생성 성공!");
      return responseData;
    } else {
      print("생성 실패!");
    }
  }
}
