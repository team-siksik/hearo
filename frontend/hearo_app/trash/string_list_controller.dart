import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class StringListController extends GetxController {
  var stringList = <String>[].obs;

  final box = GetStorage();

  @override
  void onInit() {
    super.onInit();
    if (box.hasData('stringList')) {
      stringList.assignAll(box.read<List>('stringList')!.cast<String>());
    }
  }

  void addStringToList(String newString) {
    stringList.add(newString);
    box.write('stringList', stringList.toList());
  }

  void clearList() {
    stringList.clear();
    box.remove('stringList');
  }
}
