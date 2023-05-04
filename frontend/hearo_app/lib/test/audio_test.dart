import 'package:flutter/material.dart';
import 'package:assets_audio_player/assets_audio_player.dart';

class AudioTest extends StatefulWidget {
  AudioTest({super.key});

  @override
  State<AudioTest> createState() => _AudioTestState();
}

bool _play = false;

class _AudioTestState extends State<AudioTest> {
  @override
  Widget build(BuildContext context) {
    return AudioWidget.assets(
      path: "assets/audios/hearo_start.wav",
      play: _play,
      child: TextButton(
          child: Text(
            _play ? "pause" : "play",
          ),
          onPressed: () {
            setState(() {
              _play = !_play;
            });
          }),
      onReadyToPlay: (duration) {
        //onReadyToPlay
      },
      onPositionChanged: (current, duration) {
        //onPositionChanged
      },
    );
  }
}
