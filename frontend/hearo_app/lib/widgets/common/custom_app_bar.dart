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
                  margin: const EdgeInsets.fromLTRB(0, 0, 5, 0),
                  child: Image.asset("assets/images/hearo1.png")),
              const Text(
                "Hearo",
                style: TextStyle(
                    color: Color(0xffe64e43),
                    fontSize: 24,
                    fontWeight: FontWeight.w600),
              )
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
