import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/screens/mysettings/setting_home.dart';

class CustomMainAppBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomMainAppBar({super.key});
  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: null,
      automaticallyImplyLeading: false,
      title: SizedBox(
          height: 50,
          child: Row(
            children: [
              Container(
                  margin: const EdgeInsets.fromLTRB(5, 5, 5, 5),
                  child: Image.asset("assets/images/hearo_logo_circle.png")),
              Container(
                  margin: const EdgeInsets.fromLTRB(2, 5, 5, 5),
                  child: Image.asset("assets/images/hearo_text1.png"))
            ],
          )),
      actions: [
        Padding(
          padding: const EdgeInsets.fromLTRB(0, 0, 15, 0),
          child: IconButton(
            onPressed: () {
              Get.to(() => SettingHome());
            },
            icon: const Icon(Icons.settings, color: Color(0xff929292)),
          ),
        )
      ],
      backgroundColor: Colors.transparent,
      elevation: 0.0,
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
