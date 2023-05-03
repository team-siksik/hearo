// ignore_for_file: library_private_types_in_public_api

import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';

final adList = {
  "list": [
    {"image": "assets/images/Carousel1 (2).png", "name": "1"},
    {"image": "assets/images/Carousel2 (2).png", "name": "2"},
    {"image": "assets/images/Carousel3 (2).png", "name": "3"},
  ]
};

class CarouselWidget extends StatefulWidget {
  const CarouselWidget({Key? key}) : super(key: key);

  @override
  _CarouselWidgetState createState() => _CarouselWidgetState();
}

class _CarouselWidgetState extends State<CarouselWidget> {
  @override
  Widget build(BuildContext context) {
    return CarouselSlider(
      carouselController: CarouselController(),
      options: CarouselOptions(
        autoPlayAnimationDuration: const Duration(milliseconds: 800),
        viewportFraction: 0.8,
        pauseAutoPlayOnTouch: true,
        enlargeCenterPage: true,
        autoPlay: true, //자동재생 여부
      ),
      items: adList["list"]!.map((item) {
        return Builder(builder: (BuildContext context) {
          return Image.asset(
            item["image"]!,
            fit: BoxFit.fill,
          );
        });
      }).toList(),
    );
  }
}
