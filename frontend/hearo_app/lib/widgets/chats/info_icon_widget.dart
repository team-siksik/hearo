import 'package:flutter/material.dart';
import 'package:hearo_app/widgets/chats/show_info.dart';

class InfoIconWidget extends StatelessWidget {
  const InfoIconWidget({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return IconButton(
        icon: Icon(Icons.warning_amber_rounded, color: Color(0xff3ED598)),
        onPressed: () => showInfo(context));
  }
}
