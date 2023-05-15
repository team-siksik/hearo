import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/bluetooth_controller.dart';
import 'package:hearo_app/controller/login_controller.dart';
import 'package:hearo_app/screens/glasses/chat_home_glasses.dart';
import 'package:hearo_app/screens/mysettings/favorite_say.dart';
import 'package:hearo_app/test/socket_test3.dart';
import 'package:hearo_app/widgets/common/custom_app_bar_glasses.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:animated_toggle_switch/animated_toggle_switch.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'dart:async';

class HomeScreenGlasses extends StatefulWidget {
  HomeScreenGlasses({super.key, required this.device});
  final BluetoothDevice device;
  @override
  State<HomeScreenGlasses> createState() => _HomeScreenGlassesState();
}

getPermissionCamera() async {
  var statusCamera = await Permission.camera.status;
  if (statusCamera.isGranted) {
    print('허락됨2Cameratooth');
  } else if (statusCamera.isDenied) {
    print('거절됨2Cameratooth');
    Permission.camera.request();
  }
}

class _HomeScreenGlassesState extends State<HomeScreenGlasses> {
  @override
  void initState() {
    super.initState();
    getPermissionCamera(); // 상태 연결 리스너 등록
    stateListener = widget.device.state.listen((event) {
      debugPrint('event :  $event');
      if (deviceState == event) {
        // 상태가 동일하다면 무시
        setState(() {
          if (deviceState == BluetoothDeviceState.connected) {
            positive = true;
          }
        });
      }
      // 연결 상태 정보 변경
      setBleConnectionState(event);
    });
    // 연결 시작
    connect();
  }

  LoginController loginController = Get.put(LoginController());
  DateTime? firstPress;
  int value = 0;
  bool positive = false;
  bool loading = false;
  BluetoothCharacteristic? notifyCharacteristic;
  Stream<List<int>>? notifyStream;
  List receivedData = [];
  BluetoothController bluetoothController = Get.put(BluetoothController());
  FlutterBluePlus flutterBlue = FlutterBluePlus.instance;

  // 연결 상태 표시 문자열
  String stateText = 'Connecting';

  // 연결 버튼 문자열
  String connectButtonText = 'Disconnect';

  // 현재 연결 상태 저장용
  BluetoothDeviceState deviceState = BluetoothDeviceState.disconnected;

  // 연결 상태 리스너 핸들 화면 종료시 리스너 해제를 위함
  // ignore: unused_field
  StreamSubscription<BluetoothDeviceState>? stateListener;

  late BluetoothCharacteristic characteristic;

  /* 연결 상태 갱신 */
  setBleConnectionState(BluetoothDeviceState event) {
    switch (event) {
      case BluetoothDeviceState.disconnected:
        stateText = 'Disconnected';
        // 버튼 상태 변경
        connectButtonText = 'Connect';
        break;
      case BluetoothDeviceState.disconnecting:
        stateText = 'Disconnecting';
        break;
      case BluetoothDeviceState.connected:
        stateText = 'Connected';
        // 버튼 상태 변경
        connectButtonText = 'Disconnect';
        break;
      case BluetoothDeviceState.connecting:
        stateText = 'Connecting';
        break;
    }
    //이전 상태 이벤트 저장
    deviceState = event;
    setState(() {
      if (deviceState == BluetoothDeviceState.connected) {
        positive = true;
      }
    });
  }

/* 연결 시작 */
  Future<bool> connect() async {
    Future<bool>? returnValue;
    setState(() {
      /* 상태 표시를 Connecting으로 변경 */
      stateText = 'Connecting';
    });

    /* 
    타임아웃을 10초(10000ms)로 설정 및 autoconnect 해제
     참고로 autoconnect가 true되어있으면 연결이 지연되는 경우가 있음.
   */
    await widget.device
        .connect(autoConnect: false)
        .timeout(Duration(milliseconds: 4000), onTimeout: () {
      //타임아웃 발생
      //returnValue를 false로 설정
      returnValue = Future.value(false);
      debugPrint('timeout failed');

      //연결 상태 disconnected로 변경
      setBleConnectionState(BluetoothDeviceState.disconnected);
    }).then((data) async {
      if (returnValue == null) {
        //returnValue가 null이면 timeout이 발생한 것이 아니므로 연결 성공
        debugPrint('connection successful');
        returnValue = Future.value(true);

        //서비스와 캐릭터리스틱 찾기
        List<BluetoothService> services =
            await widget.device.discoverServices();
        for (var service in services) {
          var characteristics = service.characteristics;
          for (BluetoothCharacteristic c in characteristics) {
            if (c.uuid.toString() == "0000ffe2-0000-1000-8000-00805f9b34fb") {
              print(c.uuid.toString());
              print("성공");
              characteristic = c;
              bluetoothController.setWriteChar(c);
              print(c);
              print(bluetoothController.writeCharacteristic);
              break;
            } else if (c.properties.notify) {
              notifyCharacteristic = c;
              notifyStream = notifyCharacteristic!.value;
              // 데이터 수신 리스너를 등록합니다.
              notifyStream!.listen((data) {
                setState(() {
                  receivedData.add(data);
                });
                print(data);
              });
            } else {
              print(c);
              print("실패");
            }
          }
        }
      }
    });
    print(widget.device);
    print(characteristic);
    return returnValue ?? Future.value(false);
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return WillPopScope(
      onWillPop: onWillPop,
      child: Scaffold(
        appBar: CustomMainAppBarGlasses(),
        body: SizedBox(
          width: size.width,
          height: size.height,
          child: Column(
            children: [
              Flexible(
                flex: 1,
                child: Container(
                  decoration: BoxDecoration(
                    color: Color(0xffFAFAFA),
                    borderRadius: const BorderRadius.only(
                        bottomLeft: Radius.circular(30),
                        bottomRight: Radius.circular(30)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.transparent.withOpacity(0.25),
                        spreadRadius: 0,
                        blurRadius: 1.0,
                        offset:
                            const Offset(0, 4), // changes position of shadow
                      ),
                    ],
                  ),
                  margin: const EdgeInsets.symmetric(vertical: 5),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  width: size.width,
                  child: Column(
                    children: [
                      AnimatedToggleSwitch<bool>.dual(
                        current: !positive,
                        first: false,
                        second: true,
                        dif: 80.0,
                        borderColor: Colors.transparent,
                        borderWidth: 5.0,
                        innerColor: !positive
                            ? Color.fromARGB(255, 255, 206, 206)
                            : const Color.fromARGB(255, 206, 233, 255),
                        height: 60,
                        boxShadow: const [
                          BoxShadow(
                            color: Colors.black26,
                            spreadRadius: 1,
                            blurRadius: 2,
                            offset: Offset(0, 1.5),
                          ),
                        ],
                        onChanged: (b) {
                          print(b);
                          setState(() {
                            if (deviceState == BluetoothDeviceState.connected) {
                              positive = true;
                            } else {
                              positive = false;
                            }
                          });
                          setState(() => positive = b);
                          return Future.delayed(Duration(seconds: 4));
                        },
                        colorBuilder: (b) => b
                            ? Color.fromARGB(188, 255, 126, 117)
                            : Color.fromARGB(255, 103, 174, 255),
                        iconBuilder: (value) => value
                            ? Image.asset("assets/images/banglass.png")
                            : Image.asset("assets/images/glasses.png"),
                        textBuilder: (value) => value
                            ? Center(
                                child: Text(
                                'Glass - OFF',
                                style: TextStyle(
                                    fontSize: 18,
                                    color: Color.fromARGB(255, 159, 159, 159)),
                              ))
                            : Center(
                                child: Text(
                                'Glass - ON',
                                style:
                                    TextStyle(fontSize: 18, color: Colors.blue),
                              )),
                      ),
                    ],
                  ),
                ),
              ),
              // 네비게이션 버튼들
              Flexible(
                flex: 6,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 10, 20, 5),
                  child: Column(children: [
                    InkWell(
                      onTap: () {
                        Get.to(() => ChatHomeGlasses(
                              device: widget.device,
                            ));
                      },
                      child: naviButton(size, 0),
                    ),
                    InkWell(
                      onTap: () {
                        Get.to(() => SocketTest3(
                              device: widget.device,
                            ));
                      },
                      child: naviButton(size, 2),
                    ),
                    Expanded(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          InkWell(
                              focusColor: Color(0xff1A73E8),
                              onTap: () {
                                Get.to(() => FavoriteSay());
                              },
                              child: settingButton(size, 0)),
                          InkWell(
                              onTap: () async {
                                await openAppSettings();
                              },
                              child: settingButton(size, 1)),
                        ],
                      ),
                    )
                  ]),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  Container settingButton(Size size, int idx) {
    final info = [
      {
        "img": "assets/images/free-icon-favorites-5432410.png",
        "txt": "자주 쓰는 말"
      },
      {"img": "assets/images/setperm.png", "txt": "앱 권한 설정"},
    ];
    return Container(
      width: size.width * 0.26,
      height: size.width * 0.26,
      decoration: BoxDecoration(
        border: Border.all(color: const Color.fromARGB(31, 233, 233, 233)),
        color: Colors.white,
        borderRadius: const BorderRadius.all(Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: Colors.transparent.withOpacity(0.10),
            spreadRadius: 1,
            blurRadius: 4.0,
            offset: const Offset(1, 2), // changes position of shadow
          ),
        ],
      ),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Flexible(
          flex: 1,
          child: Image.asset(info[idx]["img"]!),
        ),
        Flexible(
          flex: 1,
          child: Text(info[idx]["txt"]!),
        )
      ]),
    );
  }

  Container naviButton(Size size, int idx) {
    final info = [
      {"img": "assets/images/conversation.png", "txt": "대화 나누기"},
      {"img": "assets/images/glasses.png", "txt": "안경 이용 대화"},
      {"img": "assets/images/alarm.png", "txt": "주변 소음 인식"},
    ];
    return Container(
      margin: EdgeInsets.only(bottom: 10),
      height: size.height * 0.13,
      decoration: BoxDecoration(
        border: Border(
            bottom:
                BorderSide(color: Color.fromARGB(31, 136, 175, 255), width: 3)),
        color: Colors.transparent,
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Padding(
                  padding: const EdgeInsets.all(10),
                  child: Image.asset(info[idx]["img"]!),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 20),
                  child: Text(info[idx]["txt"]!,
                      textAlign: TextAlign.left,
                      style: TextStyle(fontSize: 28)),
                ),
              ],
            ),
            Icon(
              Icons.help_outline_rounded,
              size: 28,
            )
          ],
        ),
      ),
    );
  }

  // 뒤로 두 번 눌러야 앱 꺼짐
  Future<bool> onWillPop() {
    DateTime now = DateTime.now();
    if (firstPress == null ||
        now.difference(firstPress!) > Duration(seconds: 2)) {
      firstPress = now;
      const msg = "뒤로 버튼을 한 번 더 누르시면 종료됩니다.";
      final snackBar = SnackBar(content: Text(msg));
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return Future.value(false);
    }
    return Future.value(true);
  }
}
