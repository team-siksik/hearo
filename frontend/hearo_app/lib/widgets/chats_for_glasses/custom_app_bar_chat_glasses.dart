import 'package:flutter/material.dart';
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
  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: InfoIconWidget(),
      titleSpacing: 0.0,
      automaticallyImplyLeading: false,
      foregroundColor: Colors.black,
      elevation: 0,
      centerTitle: true,
      title: Text(""),
      backgroundColor: Colors.transparent,
      actions: <Widget>[CloseChatGlasses()],
    );
  }
}
