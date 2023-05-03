import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:assets_audio_player/assets_audio_player.dart';
import 'package:hearo_app/apis/gpt_api.dart';
import 'string_list_controller.dart';

class Screen1 extends StatelessWidget {
  final controller = Get.put(StringListController());

  Screen1({super.key});
  final AudioPlayer player = AudioPlayer();
  Future playSound() async {
    // await player.setSourceAsset("assets/audios/hearo_start.wav");
    await player.setSource(AssetSource("assets/audios/hearo_start.wav"));
    // await player.play(DeviceFileSource("assets/audios/hearo_start.wav"));
  }

  final AssetsAudioPlayer assetsAudioPlayer = AssetsAudioPlayer.newPlayer();
  void playAudio() async {
    await assetsAudioPlayer.open(
      Audio("assets/audios/hearo_start.wav"),
      loopMode: LoopMode.none, //반복 여부 (LoopMode.none : 없음)
      autoStart: false, //자동 시작 여부
      showNotification: false, //스마트폰 알림 창에 띄울지 여부
    );

    assetsAudioPlayer.play(); //재생
    // assetsAudioPlayer.pause(); //멈춤
    // assetsAudioPlayer.stop(); //정지
  }

  Future getSentence(text) async {
    await ApiGpt.sayCreateApi(text);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Screen 1'),
      ),
      body: Column(
        children: [
          // AudioTest(),
          ElevatedButton(
            onPressed: () {
              // playSound();
              // playAudio();
              getSentence("이 안건에 대해 어떻게 생각하세요?");
            },
            child: Text('Clear'),
          ),
        ],
      ),
    );
  }
}
