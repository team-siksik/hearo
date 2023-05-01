import 'package:auto_size_text/auto_size_text.dart';
import 'package:bubble/bubble.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/chat_controller.dart';
import 'package:hearo_app/controller/my_data_controller.dart';

class FavoriteStar extends StatefulWidget {
  final Size size;
  final TextEditingController textController;
  FavoriteStar({super.key, required this.size, required this.textController});

  @override
  State<FavoriteStar> createState() => _FavoriteStarState();
}

class _FavoriteStarState extends State<FavoriteStar> {
  final chatController = Get.put(ChatController());
  final myDataControll = Get.put(MyDataController());
  // final MyDataController myDataController = Get.find();

  @override // 알람 디테일 받아오기
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
        onPressed: () => chatDialog(context),
        icon: Animate(
          effects: [ScaleEffect(), FadeEffect()],
          autoPlay: true,
          child: Icon(Icons.star_rounded, color: Colors.amber, size: 32),
        ));
  }

  Future<dynamic> chatDialog(BuildContext context) {
    return showDialog(
        context: context,
        builder: (BuildContext context) => AlertDialog(
              title: Text(
                "자주 쓰는 말",
                textAlign: TextAlign.center,
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(25))),
              content: SizedBox(
                height: widget.size.width * 0.8,
                width: widget.size.width * 0.8,
                child: Obx(
                  () => ListView.separated(
                    separatorBuilder: (context, index) => SizedBox(
                      height: widget.size.height * 0.017,
                    ),
                    itemCount: myDataControll.sayings.length,
                    itemBuilder: (context, index) {
                      var saying = myDataControll.sayings[index];
                      return favoriteSay(context, widget.size, saying);
                    },
                  ),
                ),
              ),
            ));
  }

  GestureDetector favoriteSay(BuildContext context, Size size, saying) {
    final chatController = Get.put(ChatController());
    return GestureDetector(
      onTap: () {
        widget.textController.text = saying;
        chatController.changeSaying(saying);
        Get.back();
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          SizedBox(
            width: size.width * 0.6,
            child: Bubble(
              radius: Radius.circular(14),
              elevation: 0.8,
              shadowColor: Colors.black45,
              borderColor: Colors.black26,
              color: Colors.white,
              padding: BubbleEdges.fromLTRB(15, 10, 15, 10),
              alignment: Alignment.centerRight,
              nip: BubbleNip.rightTop,
              child: AutoSizeText(
                saying,
                style: TextStyle(fontSize: 20),
                maxLines: 3,
                textAlign: TextAlign.right,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
