import 'package:flutter/material.dart';

class CustomAppBarInner extends StatelessWidget implements PreferredSizeWidget {
  final String name;
  const CustomAppBarInner({super.key, required this.name});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      foregroundColor: Colors.black,
      elevation: 1,
      centerTitle: true,
      title: Text(name, style: TextStyle(fontWeight: FontWeight.w600)),
      backgroundColor: Colors.white,
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
