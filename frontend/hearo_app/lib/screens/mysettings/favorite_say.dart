import 'package:flutter/material.dart';
import 'package:hearo_app/widgets/common/custom_app_bar_inner.dart';

class FavoriteSay extends StatelessWidget {
  const FavoriteSay({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBarInner(name: "자주 쓰는 말"),
      body: Text("자주 쓰는 말 스크린"),
    );
  }
}
