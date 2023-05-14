import 'package:flutter/material.dart';
import 'package:hearo_app/widgets/chats/close_chat.dart';
import 'package:hearo_app/widgets/chats/info_icon_widget.dart';

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
      actions: <Widget>[CloseChat()],
    );
  }
}
