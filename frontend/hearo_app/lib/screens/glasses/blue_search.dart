import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:get/get.dart';
import 'package:hearo_app/screens/glasses/chat_home_glasses.dart';

class BlueSearch extends StatefulWidget {
  const BlueSearch({super.key});

  @override
  State<BlueSearch> createState() => _Screen2State();
}

class _Screen2State extends State<BlueSearch> {
  FlutterBluePlus flutterBlue = FlutterBluePlus.instance;
  List<ScanResult> scanResultList = [];
  bool _isScanning = false;
  final String targetDeviceName = 'HC-06';

  @override
  initState() {
    super.initState();
    // 블루투스 초기화
    initBle();
  }

  void initBle() {
    // BLE 스캔 상태 얻기 위한 리스너
    flutterBlue.isScanning.listen((isScanning) {
      _isScanning = isScanning;
      setState(() {});
    });
  }

  /*
  스캔 시작/정지 함수
  */
  scan() async {
    if (!_isScanning) {
      // 스캔 중이 아니라면
      // 기존에 스캔된 리스트 삭제
      scanResultList.clear();
      // 스캔 시작, 제한 시간 4초
      flutterBlue.startScan(timeout: Duration(seconds: 4));
      // 스캔 결과 리스너
      flutterBlue.scanResults.listen((results) {
        // 결과 값을 루프로 돌림
        for (var element in results) {
          //찾는 장치명인지 확인
          if (element.device.name == targetDeviceName) {
            // 장치의 ID를 비교해 이미 등록된 장치인지 확인
            if (scanResultList
                    .indexWhere((e) => e.device.id == element.device.id) <
                0) {
              // 찾는 장치명이고 scanResultList에 등록된적이 없는 장치라면 리스트에 추가
              scanResultList.add(element);
            }
          }
          // UI 갱신
          setState(() {});
        }
      });
    } else {
      // 스캔 중이라면 스캔 정지
      flutterBlue.stopScan();
    }
  }

/*
   여기서부터는 장치별 출력용 함수들
  */
  /*  장치의 신호값 위젯  */
  Widget deviceSignal(ScanResult r) {
    return Text(r.rssi.toString());
  }

  /* 장치의 MAC 주소 위젯  */
  Widget deviceMacAddress(ScanResult r) {
    return Text(r.device.id.id);
  }

  /* 장치의 명 위젯  */
  Widget deviceName(ScanResult r) {
    String name = '';

    if (r.device.name.isNotEmpty) {
      // device.name에 값이 있다면
      name = r.device.name;
    } else if (r.advertisementData.localName.isNotEmpty) {
      // advertisementData.localName에 값이 있다면
      name = r.advertisementData.localName;
    } else {
      // 둘다 없다면 이름 알 수 없음...
      name = 'N/A';
    }
    return Text(name);
  }

  /* BLE 아이콘 위젯 */
  Widget leading(ScanResult r) {
    return SizedBox(child: Image.asset("assets/images/glasses.png"));
  }

  /* 장치 아이템을 탭 했을때 호출 되는 함수 */
  void onTap(ScanResult r) {
    // 단순히 이름만 출력
    print(r.device.name);
    // Get.to(
    //   () => DeviceScreen(
    //     device: r.device,
    //   ),
    Get.to(
      () => ChatHomeGlasses(
        device: r.device,
      ),
    );
  }

  /* 장치 아이템 위젯 */
  Widget listItem(ScanResult r) {
    return ListTile(
      onTap: () => onTap(r),
      leading: leading(r),
      title: deviceName(r),
      subtitle: deviceMacAddress(r),
      trailing: deviceSignal(r),
    );
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.sizeOf(context);
    return Scaffold(
      appBar: AppBar(
        title: Text("blue"),
      ),
      body: SizedBox(
        height: size.height,
        child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            /* 장치 리스트 출력 */
            children: [
              Flexible(
                flex: 3,
                child: SizedBox(
                  height: 100,
                  width: size.width,
                  // child: Text('블루투스'),
                ),
              ),
              Flexible(
                flex: 10,
                child: ListView.separated(
                  itemCount: scanResultList.length,
                  itemBuilder: (context, index) {
                    return listItem(scanResultList[index]);
                  },
                  separatorBuilder: (BuildContext context, int index) {
                    return Divider();
                  },
                ),
              ),
            ]),
      ),
      /* 장치 검색 or 검색 중지  */
      floatingActionButton: FloatingActionButton(
        onPressed: scan,
        // 스캔 중이라면 stop 아이콘을, 정지상태라면 search 아이콘으로 표시
        child: Icon(_isScanning ? Icons.stop : Icons.search),
      ),
    );
  }
}
