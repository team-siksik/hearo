import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'string_list_controller.dart';

class Screen1 extends StatelessWidget {
  final controller = Get.put(StringListController());

  Screen1({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Screen 1'),
      ),
      body: Column(
        children: [
          TextField(
            onSubmitted: (newString) {
              controller.addStringToList(newString);
            },
          ),
          Expanded(
            child: Obx(() => ListView.builder(
                  itemCount: controller.stringList.length,
                  itemBuilder: (context, index) {
                    return ListTile(
                      title: Text(controller.stringList[index]),
                    );
                  },
                )),
          ),
          ElevatedButton(
            onPressed: () {
              controller.clearList();
            },
            child: Text('Clear'),
          ),
        ],
      ),
    );
  }
}
