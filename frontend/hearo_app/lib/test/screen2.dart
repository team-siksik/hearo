import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class Screen2 extends StatefulWidget {
  const Screen2({super.key});

  @override
  State<Screen2> createState() => _Screen2State();
}

class _Screen2State extends State<Screen2> {
  FlutterBluePlus blue = FlutterBluePlus.instance;
  List result = [];
  bool check = false;
  String viewTxt = "";
  @override
  initState() {
    super.initState();
    blue.scanResults.listen((results) {
      print("검색중 ...");
      print("results : $results");
      if (results.isNotEmpty) {
        setState(() {
          result = results;
        });
      }
    });
    blue.connectedDevices.asStream().listen((List<BluetoothDevice> devices) {
      for (BluetoothDevice device in devices) {
        print("device: $device");
      }
    });
  }

  Future blueBtn() async {
    setState(() {
      check = true;
      viewTxt = "검색중...";
    });
    var bl = await blue
        .startScan(
            scanMode: ScanMode.balanced,
            allowDuplicates: true,
            timeout: Duration(seconds: 12))
        .timeout(Duration(seconds: 12), onTimeout: () async {
      await blue.stopScan();
      setState(() {
        check = false;
        viewTxt = "ERR";
      });
    });
    print("startScan : $bl");

    await Future.delayed(Duration(seconds: 13), () async {
      await blue.stopScan();
      setState(() {
        check = false;
        if (result.isEmpty) {
          viewTxt = "대기중...";
        }
      });
    });
  }

  /* UI */
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("블루투스"),
        ),
        body: Center(
            /* 장치 리스트 출력 */
            child: Column(
          children: [
            TextButton(
                onPressed: () {
                  blueBtn();
                },
                child: Text("Blue")),
            Container(
                height: 500,
                padding: EdgeInsets.all(10),
                color: check ? Colors.blue : Colors.red,
                child: SingleChildScrollView(child: Text(result.toString())))
          ],
        )));
  }
}
