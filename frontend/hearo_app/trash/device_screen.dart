// ignore_for_file: library_private_types_in_public_api, empty_catches

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class DeviceScreen extends StatefulWidget {
  DeviceScreen({Key? key, required this.device}) : super(key: key);

  final BluetoothDevice device;

  @override
  _DeviceScreenState createState() => _DeviceScreenState();
}

class _DeviceScreenState extends State<DeviceScreen> {
  FlutterBluePlus flutterBlue = FlutterBluePlus.instance;
  String stateText = 'Connecting';
  String connectButtonText = 'Disconnect';
  BluetoothDeviceState deviceState = BluetoothDeviceState.disconnected;
  StreamSubscription<BluetoothDeviceState>? stateListener;
  List<BluetoothService> bluetoothService = [];
  Map<String, List<int>> notifyDatas = {};

  @override
  void initState() {
    super.initState();
    stateListener = widget.device.state.listen((event) {
      debugPrint('event: $event');
      if (deviceState == event) {
        return;
      }
      setBleConnectionState(event);
    });
    connect();
  }

  @override
  void dispose() {
    stateListener?.cancel();
    disconnect();
    super.dispose();
  }

  @override
  void setState(VoidCallback fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  void setBleConnectionState(BluetoothDeviceState event) {
    setState(() {
      switch (event) {
        case BluetoothDeviceState.disconnected:
          stateText = 'Disconnected';
          connectButtonText = 'Connect';
          break;
        case BluetoothDeviceState.disconnecting:
          stateText = 'Disconnecting';
          break;
        case BluetoothDeviceState.connected:
          stateText = 'Connected';
          connectButtonText = 'Disconnect';
          break;
        case BluetoothDeviceState.connecting:
          stateText = 'Connecting';
          break;
      }
      deviceState = event;
    });
  }

  Future<bool> connect() async {
    try {
      setState(() {
        stateText = 'Connecting';
      });

      await widget.device
          .connect(autoConnect: false)
          .timeout(Duration(milliseconds: 15000));

      setState(() {
        stateText = 'Connected';
        connectButtonText = 'Disconnect';
      });

      bluetoothService.clear();
      List<BluetoothService> bleServices =
          await widget.device.discoverServices();
      setState(() {
        bluetoothService = bleServices;
      });

      for (BluetoothService service in bleServices) {
        print('============================================');
        print('Service UUID: ${service.uuid}');
        for (BluetoothCharacteristic c in service.characteristics) {
          if (c.properties.notify &&
              c.descriptors.isNotEmpty &&
              !c.isNotifying) {
            try {
              await c.setNotifyValue(true);
              notifyDatas[c.uuid.toString()] = List.empty();
              c.value.listen((value) {
                print('${c.uuid}: ${value.runtimeType} @@@@@@@@@@@@@@@@@@@@@');
                print(value);
                print("#############");
                setState(() {
                  notifyDatas[c.uuid.toString()] = value;
                });
              });
              await Future.delayed(const Duration(milliseconds: 500));
            } catch (e) {
              print('error ${c.uuid} $e');
            }
          }
        }
      }

      return true;
    } catch (e) {
      print('connection failed: $e');
      setState(() {
        stateText = 'Disconnected';
        connectButtonText = 'Connect';
      });
      return false;
    }
  }

  /* 연결 해제 */
  void disconnect() {
    try {
      setState(() {
        stateText = 'Disconnecting';
      });
      widget.device.disconnect();
    } catch (e) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        /* 장치명 */
        title: Text(widget.device.name),
      ),
      body: Center(
          child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              /* 연결 상태 */
              Text(stateText),
              /* 연결 및 해제 버튼 */
              OutlinedButton(
                  onPressed: () {
                    if (deviceState == BluetoothDeviceState.connected) {
                      /* 연결된 상태라면 연결 해제 */
                      disconnect();
                    } else if (deviceState ==
                        BluetoothDeviceState.disconnected) {
                      /* 연결 해재된 상태라면 연결 */
                      connect();
                    }
                  },
                  child: Text(connectButtonText)),
            ],
          ),

          /* 연결된 BLE의 서비스 정보 출력 */
          Expanded(
            child: ListView.separated(
              itemCount: bluetoothService.length,
              itemBuilder: (context, index) {
                return listItem(bluetoothService[index]);
              },
              separatorBuilder: (BuildContext context, int index) {
                return Divider();
              },
            ),
          ),
        ],
      )),
    );
  }

  /* 각 캐릭터리스틱 정보 표시 위젯 */
  Widget characteristicInfo(BluetoothService r) {
    String name = '';
    String properties = '';
    String data = '';
    // 캐릭터리스틱을 한개씩 꺼내서 표시
    for (BluetoothCharacteristic c in r.characteristics) {
      properties = '';
      data = '';
      name += '\t\t${c.uuid}\n';
      if (c.properties.write) {
        properties += 'Write ';
      }
      if (c.properties.read) {
        properties += 'Read ';
      }
      if (c.properties.notify) {
        properties += 'Notify ';
        if (notifyDatas.containsKey(c.uuid.toString())) {
          // notify 데이터가 존재한다면
          if (notifyDatas[c.uuid.toString()]!.isNotEmpty) {
            data = notifyDatas[c.uuid.toString()].toString();
            // print("ASDFADSF");
            // print(notifyDatas[c.uuid.toString()]);
          }
        }
      }
      if (c.properties.writeWithoutResponse) {
        properties += 'WriteWR ';
      }
      if (c.properties.indicate) {
        properties += 'Indicate ';
      }
      name += '\t\t\tProperties: $properties\n';
      if (data.isNotEmpty) {
        // 받은 데이터 화면에 출력!
        name += '\t\t\t\t$data\n';
      }
    }
    return Text(name);
  }

  /* Service UUID 위젯  */
  Widget serviceUUID(BluetoothService r) {
    String name = '';
    name = r.uuid.toString();
    return Text(name);
  }

  /* Service 정보 아이템 위젯 */
  Widget listItem(BluetoothService r) {
    return ListTile(
      onTap: null,
      title: serviceUUID(r),
      subtitle: characteristicInfo(r),
    );
  }
}
