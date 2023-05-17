// import 'package:flutter/material.dart';
// import 'package:flutter_blue_plus/flutter_blue_plus.dart';

// class Test3 extends StatefulWidget {
//   const Test3({super.key});

//   @override
//   _Test3State createState() => _Test3State();
// }

// class _Test3State extends State<Test3> {
//   static const String SERVICE_UUID = "00001101-0000-1000-8000-00805f9b34fb";
//   static const String CHARACTERISTIC_UUID =
//       "00001101-0000-1000-8000-00805f9b34fb";

//   FlutterBluePlus flutterBlue = FlutterBluePlus.instance;
//   BluetoothDevice? connectedDevice;
//   Stream<List<int>>? receiveStream;
//   String receivedData = "";

//   @override
//   void initState() {
//     super.initState();
//     flutterBlue.state.listen((state) {
//       if (state == BluetoothState.on) {
//         scanDevices();
//       }
//     });
//   }

//   void scanDevices() {
//     flutterBlue.startScan(timeout: Duration(seconds: 4));

//     flutterBlue.scanResults.listen((results) {
//       for (ScanResult result in results) {
//         if (result.device.name.contains("HC-06")) {
//           connectToDevice(result.device);
//         }
//       }
//     });
//   }

//   void connectToDevice(BluetoothDevice device) async {
//     flutterBlue.stopScan();

//     await device.connect(autoConnect: false);

//     List<BluetoothService> services = await device.discoverServices();

//     for (BluetoothService service in services) {
//       if (service.uuid.toString() == SERVICE_UUID) {
//         print("checked1");
//         for (BluetoothCharacteristic characteristic
//             in service.characteristics) {
//           if (characteristic.uuid.toString() == CHARACTERISTIC_UUID) {
//             print("checked2");
//             setState(() {
//               connectedDevice = device;
//               receiveStream = characteristic.value;
//               receiveStream!.listen((data) {
//                 setState(() {
//                   receivedData = String.fromCharCodes(data);
//                 });
//               });
//             });
//             break;
//           }
//         }
//         break;
//       }
//     }
//   }

//   void sendData(String data) async {
//     print(connectedDevice);
//     if (connectedDevice != null) {
//       List<int> dataBytes = data.codeUnits;
//       List<BluetoothService> services =
//           await connectedDevice!.discoverServices();

//       for (BluetoothService service in services) {
//         for (BluetoothCharacteristic characteristic
//             in service.characteristics) {
//           if (characteristic.uuid.toString() == CHARACTERISTIC_UUID) {
//             await characteristic.write(dataBytes);
//             return;
//           }
//         }
//       }
//     }
//   }

//   void disconnectDevice() async {
//     if (connectedDevice != null) {
//       await connectedDevice!.disconnect();
//       setState(() {
//         connectedDevice = null;
//         receiveStream = null;
//         receivedData = "";
//       });
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Bluetooth 통신'),
//       ),
//       body: Center(
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             Text('수신된 데이터: $receivedData'),
//             ElevatedButton(
//               onPressed: () {
//                 scanDevices();
//               },
//               child: Text('기기 스캔'),
//             ),
//             ElevatedButton(
//               onPressed: () {
//                 sendData("3");
//               },
//               child: Text('데이터 전송'),
//             ),
//             ElevatedButton(
//               onPressed: () {
//                 disconnectDevice();
//               },
//               child: Text('연결끊기'),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }
