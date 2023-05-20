import 'package:flutter/material.dart';
import 'package:hearo_app/widgets/chats/show_info_detail.dart';

class HelpIconWidget extends StatelessWidget {
  const HelpIconWidget({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return IconButton(
        icon: Icon(Icons.live_help_outlined,
            color: Color.fromARGB(255, 62, 113, 243)),
        onPressed: () => showInfoDetail(context));
  }
}
