import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:get/get.dart';
import 'package:hearo_app/controller/login_controller.dart';

LoginController loginController = Get.put(LoginController());
// const base = 'http://10.0.2.2:8080/api/v1/profile/frequent';
const base = 'http://k8a603.p.ssafy.io:8080/api/v1/profile/frequent';

class ApiSay {
  static Future sayGetApi() async {
    final response = await http.get(
      Uri.parse(base),
      headers: {
        HttpHeaders.authorizationHeader: loginController.loginData[0]
            ["accessToken"],
      },
    );
    if (response.statusCode == 200) {
      final responseData = jsonDecode(utf8.decode(response.bodyBytes));
      print("가져오기 성공! in say_api");
      return responseData["data"];
    } else {
      print("가져오기 실패!");
    }
  }

  static Future sayCreateApi(sentence) async {
    final response = await http.post(
      Uri.parse(base),
      headers: {
        HttpHeaders.authorizationHeader: loginController.loginData[0]
            ["accessToken"],
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: json.encode({"sentence": sentence}),
    );
    if (response.statusCode == 200) {
      print("생성 성공!");
    } else {
      print("생성 실패!");
    }
  }

  static Future sayUpdateApi(sentence, seq) async {
    final response = await http.put(
      Uri.parse('$base/$seq'),
      headers: {
        HttpHeaders.authorizationHeader: loginController.loginData[0]
            ["accessToken"],
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: json.encode({"sentence": sentence}),
    );
    if (response.statusCode == 200) {
      print("업데이트 성공!");
    } else {
      print("업데이트 실패!");
    }
  }

  static Future sayDeleteApi(seq) async {
    final response = await http.put(
      Uri.parse('$base/$seq/delete'),
      headers: {
        HttpHeaders.authorizationHeader: loginController.loginData[0]
            ["accessToken"],
        'Content-Type': 'application/json; charset=UTF-8',
      },
    );
    if (response.statusCode == 200) {
      print("삭제 성공!");
    } else {
      print("삭제 실패!");
    }
  }
}
