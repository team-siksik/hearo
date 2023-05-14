import 'dart:convert';
import 'dart:io';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:path_provider/path_provider.dart';
import 'package:hearo_app/skills/socket_overall.dart';

class SocketTest3 extends StatefulWidget {
  const SocketTest3({super.key, required this.device});
  final BluetoothDevice device;
  @override
  State<SocketTest3> createState() => _SocketTest3State();
}

class _SocketTest3State extends State<SocketTest3> {
  final SocketOverall audioSocket = SocketOverall();
  final FlutterSoundRecorder _audioRecorder = FlutterSoundRecorder();
  final FlutterSoundPlayer _audioPlayer = FlutterSoundPlayer();
  late String _recordingFilePath;
  bool _isRecording = false;
  List temp = [];

  FlutterBluePlus flutterBlue = FlutterBluePlus.instance;
  String stateText = 'Connecting';
  String connectButtonText = 'Disconnect';
  BluetoothDeviceState deviceState = BluetoothDeviceState.disconnected;
  StreamSubscription<BluetoothDeviceState>? _stateListener;
  List<BluetoothService> bluetoothService = [];
  Map<String, List<int>> notifyDatas = {};
  final _scrollController = ScrollController();
  @override
  void initState() {
    super.initState();
    _initializeAudioRecorder();
    _initializeAudioPlayer();
    audioSocket.connect();
    audioSocket.enterRoom("1111");
    _stateListener = widget.device.state.listen((event) {
      debugPrint('event: $event');
      if (deviceState == event) {
        return;
      }
      setBleConnectionState(event);
    });
    connect();
    setState(() {});
  }

  @override
  void dispose() {
    audioSocket.closeRoom("1111");
    audioSocket.disconnect();
    _audioRecorder.closeRecorder();
    _audioPlayer.closePlayer();
    _stateListener?.cancel();
    super.dispose();
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
                String base64Data = base64.encode(value); // value를 base64로 인코딩
                print('${c.uuid}: $base64Data @@@@@@@@@@@@@@@@@@@@@');
                print(value);
                print("#############");
                setState(() {
                  notifyDatas[c.uuid.toString()] = value; // base64 데이터를 저장
                  temp.add(base64Data.toString());
                });
              });
              _scrollController
                  .jumpTo(_scrollController.position.maxScrollExtent);
              await Future.delayed(const Duration(milliseconds: 300));
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

  Future<void> _initializeAudioRecorder() async {
    await _audioRecorder.openRecorder();
    // _audioRecorder.setSubscriptionDuration(Duration(milliseconds: 100));
  }

  Future<void> _initializeAudioPlayer() async {
    await _audioPlayer.openPlayer();
  }

  Future<void> _startRecording() async {
    try {
      setState(() {
        _isRecording = true;
      });
      final tempDir = await getTemporaryDirectory();
      final recordingFileName =
          'recording_${DateTime.now().microsecondsSinceEpoch}.wav';
      final recordingFilePath = '${tempDir.path}/$recordingFileName';
      await _audioRecorder.startRecorder(
          toFile: recordingFilePath, codec: Codec.pcm16WAV);

      setState(() {
        _recordingFilePath = recordingFilePath;
      });
    } catch (e) {
      print(e.toString());
    }
  }

  Future<void> _stopRecording() async {
    try {
      _audioRecorder.stopRecorder();
      File file = File(_recordingFilePath);
      List<int> fileData = file.readAsBytesSync();
      String fileDataB64 = base64Encode(fileData);
      audioSocket.sendClassification('1111', fileDataB64);
      audioSocket.socket.on(
        "audio",
        (data) {
          temp.add(data);
          print(data);
        },
      );
    } catch (e) {
      print(e.toString());
    }
  }

  void _recordAndSendEverySecond() async {
    setState(() {
      _isRecording = true;
    });

    while (_isRecording) {
      _startRecording();
      await Future.delayed(Duration(milliseconds: 1000));
      _stopRecording();
      String datum = audioSocket.getClassification();
      print(datum);
      if (datum != "") {
        temp.add(datum);
      }
    }
  }

  void _stopSendRecording() async {
    setState(() {
      _isRecording = false;
    });
    await _audioRecorder.stopRecorder();
    await _audioRecorder.closeRecorder();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('음성소켓 연습3'),
      ),
      body: Center(
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                IconButton(
                  onPressed: _recordAndSendEverySecond,
                  icon: Icon(Icons.mic),
                ),
                SizedBox(width: 10),
                IconButton(
                  onPressed: _stopSendRecording,
                  icon: Icon(Icons.stop),
                ),
                SizedBox(width: 10),
                IconButton(
                  onPressed: () {
                    print(temp);
                  },
                  icon: Icon(Icons.text_increase_rounded),
                ),
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
            Expanded(
                child: ListView.separated(
                    itemBuilder: (context, index) {
                      var txt = temp[index];
                      return Text(txt);
                    },
                    separatorBuilder: (context, index) => SizedBox(
                          height: 5,
                        ),
                    itemCount: temp.length))
          ],
        ),
      ),
    );
  }
}
