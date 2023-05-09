import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:get/get.dart';
import 'package:hearo_app/controller/login_controller.dart';

// const base = 'http://10.0.2.2:8080/api/v1/accounts';
const base = 'http://k8a603.p.ssafy.io:8080/api/v1/accounts';
LoginController loginController = Get.put(LoginController());

class ApiLog {
  static Future loginApi(String accessToken) async {
    final response = await http.get(
      Uri.parse('$base/login'),
      headers: {
        HttpHeaders.authorizationHeader: accessToken,
      },
    );
    if (response.statusCode == 200) {
      final responseData = jsonDecode(utf8.decode(response.bodyBytes));
      loginController.setData(responseData["data"]);
      return true;
    } else {
      return false;
    }
  }

  static Future logoutApi() async {
    final response = await http.get(
      Uri.parse('$base/signout'),
      headers: {
        HttpHeaders.authorizationHeader: loginController.loginData[0]
            ["accessToken"],
      },
    );
    if (response.statusCode == 200) {
      loginController.clearList();
      return true;
    } else {
      return false;
    }
  }

  static Future withdrawApi() async {
    final response = await http.get(
      Uri.parse('$base/withdraw'),
      headers: {
        HttpHeaders.authorizationHeader: loginController.loginData[0]
            ["accessToken"],
      },
    );
    if (response.statusCode == 200) {
      loginController.clearList();
      return true;
    } else {
      return false;
    }
  }
}
