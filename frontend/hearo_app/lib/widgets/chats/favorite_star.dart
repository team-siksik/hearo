import 'package:auto_size_text/auto_size_text.dart';
import 'package:bubble/bubble.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:get/get.dart';
import 'package:hearo_app/apis/say_api.dart';
import 'package:hearo_app/controller/chat_controller.dart';

class FavoriteStar extends StatefulWidget {
  final Size size;
  final TextEditingController textController;
  FavoriteStar({super.key, required this.size, required this.textController});

  @override
  State<FavoriteStar> createState() => _FavoriteStarState();
}

class _FavoriteStarState extends State<FavoriteStar> {
  // final chatController = Get.put(ChatController());
  List favorite = [];
  List favoriteSentences = [];

  @override
  void initState() {
    super.initState();
    loadfavorites();
  }

  Future<void> loadfavorites() async {
    final favorites = await ApiSay.sayGetApi();
    setState(() {
      favorite = favorites;
      favoriteSentences = [];
      for (var item in favorites) {
        favoriteSentences.add(item["sentence"]);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
        onPressed: () async {
          await loadfavorites();
          await chatDialog();
        },
        icon: Animate(
          effects: [ScaleEffect(), FadeEffect()],
          autoPlay: true,
          child: Icon(Icons.star_rounded, color: Colors.amber, size: 32),
        ));
  }

  Future<dynamic> chatDialog() {
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
          child: ListView.separated(
            separatorBuilder: (context, index) => SizedBox(
              height: widget.size.height * 0.017,
            ),
            itemCount: favoriteSentences.length,
            itemBuilder: (context, index) {
              var saying = favorite[index]["sentence"];
              return favoriteSay(context, widget.size, saying);
            },
          ),
        ),
      ),
    );
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
