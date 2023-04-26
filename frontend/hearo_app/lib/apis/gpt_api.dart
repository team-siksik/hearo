// import 'package:dio/dio.dart';
// import 'package:dio'

// Future<String> getAnswerFromGpt(String question) async {
//   final apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
//   final apiKey = 'YOUR_API_KEY'; // OpenAI API 키 입력

//   final dio = Dio();
//   dio.interceptors.add(DioCacheManager(
//       CacheConfig(baseUrl: apiUrl, defaultMaxAge: Duration(minutes: 5)))
//       .interceptor);

//   final data = {
//     'prompt': question,
//     'max_tokens': 100
//   };

//   final response = await dio.post(apiUrl,
//       options: buildCacheOptions(Duration(minutes: 5)),
//       headers: {'Authorization': 'Bearer $apiKey', 'Content-Type': 'application/json'},
//       data: data);
//   if (response.statusCode == 200) {
//     final result = response.data;
//     final answer = result['choices'][0]['text'].toString();
//     return answer;
//   } else {
//     // API 호출에 실패한 경우 예외 처리
//     throw Exception('Failed to get answer from GPT API');
//   }
// }
