import 'package:flutter/material.dart';
import 'package:hearo_app/widgets/chats/close_chat.dart';
import 'package:hearo_app/widgets/chats/info_icon_widget.dart';
import 'dart:async';

class CustomAppBarChat extends StatefulWidget implements PreferredSizeWidget {
  CustomAppBarChat({Key? key})
      : preferredSize = Size.fromHeight(kToolbarHeight),
        super(key: key);

  @override
  final Size preferredSize;

  @override
  State<CustomAppBarChat> createState() => _CustomAppBarChatState();
}

class _CustomAppBarChatState extends State<CustomAppBarChat> {
  Stopwatch stopwatch = Stopwatch();
  String stopWatchText = '00:00';
  late Timer timer;
  void _startTimer() {
    timer = Timer.periodic(Duration(milliseconds: 100), (timer) {
      setState(() {
        _updateStopWatchText();
      });
    });
  }

  void _updateStopWatchText() {
    stopWatchText =
        "${stopwatch.elapsed.inMinutes.toString().padLeft(2, "0")}:${(stopwatch.elapsed.inSeconds % 60).toString().padLeft(2, "0")}";
  }

  @override
  void initState() {
    super.initState();
    stopwatch.start();
    _startTimer();
  }

  @override
  void dispose() {
    timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: InfoIconWidget(),
      titleSpacing: 0.0,
      automaticallyImplyLeading: false,
      foregroundColor: Colors.black,
      elevation: 0,
      centerTitle: true,
      title: Text(stopWatchText),
      backgroundColor: Colors.transparent,
      actions: <Widget>[CloseChat()],
    );
  }
}
