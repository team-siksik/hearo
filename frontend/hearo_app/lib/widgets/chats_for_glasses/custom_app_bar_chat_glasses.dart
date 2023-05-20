import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/blue_test_controller.dart';
import 'package:hearo_app/widgets/chats/help_icon_widget.dart';
import 'package:hearo_app/widgets/chats/info_icon_widget.dart';
import 'package:hearo_app/widgets/chats_for_glasses/close_chat_glasses.dart';

class CustomAppBarChatGlasses extends StatefulWidget
    implements PreferredSizeWidget {
  CustomAppBarChatGlasses({Key? key})
      : preferredSize = Size.fromHeight(kToolbarHeight),
        super(key: key);

  @override
  final Size preferredSize;

  @override
  State<CustomAppBarChatGlasses> createState() =>
      _CustomAppBarChatGlassesState();
}

class _CustomAppBarChatGlassesState extends State<CustomAppBarChatGlasses> {
  BlueTestController bluetoothController = Get.find<BlueTestController>();

  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: InfoIconWidget(),
      titleSpacing: 0.0,
      automaticallyImplyLeading: false,
      foregroundColor: Colors.black,
      elevation: 0,
      title: HelpIconWidget(),
      backgroundColor: Colors.transparent,
      actions: <Widget>[CloseChatGlasses()],
    );
  }
}
