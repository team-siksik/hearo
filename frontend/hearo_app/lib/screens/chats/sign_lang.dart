import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:hearo_app/skills/socket_overall.dart';
import 'package:hearo_app/widgets/common/custom_app_bar_inner.dart';
import 'package:image/image.dart' as img;

class SignLang extends StatefulWidget {
  const SignLang({Key? key}) : super(key: key);

  @override
  State<SignLang> createState() => _SignLangState();
}

class _SignLangState extends State<SignLang> {
  late Timer timer;
  final SocketOverall videoSocket = SocketOverall();
  late List<CameraDescription> cameras;
  late CameraController cameraController;
  bool isStreamingImages = false;
  String what = '카메라 버튼을 눌러 인식 시작';
  List temp = [
    "start",
    "start",
    "start",
    "start",
    "start",
    "start",
    "start",
    "start",
    "start",
    "start",
    "start",
  ];
  @override
  void setState(VoidCallback fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  @override
  void initState() {
    videoSocket.connect();
    videoSocket.enterRoom();

    availableCameras().then((availableCameras) {
      cameras = availableCameras;
      late CameraDescription frontCamera;
      for (final camera in cameras) {
        if (camera.lensDirection == CameraLensDirection.front) {
          frontCamera = camera;
          break;
        }
      }
      cameraController =
          CameraController(frontCamera, ResolutionPreset.veryHigh);

      cameraController.initialize().then((_) {
        if (!mounted) {
          return;
        }
        setState(() {});
      });
    });

    super.initState();
  }

  @override
  void dispose() {
    stopFunction(); // 타이머를 멈추는 함수 호출

    cameraController.dispose();
    videoSocket.closeRoom();
    videoSocket.disconnect();
    super.dispose();
  }

  void stopFunction() {
    // 타이머가 실행 중인 경우에만 취소
    if (timer.isActive) {
      timer.cancel();
      setState(() {
        isStreamingImages = false;
      });
    }
  }

  void startImageStream() async {
    if (!isStreamingImages) {
      setState(() {
        isStreamingImages = true;
      });
      cameraController.startImageStream((CameraImage availableImage) {
        if (isStreamingImages) {
          processCameraImage(availableImage);
        }
      });
    }
  }

  void startSend() {
    setState(() {
      isStreamingImages = true;
    });
    timer = timeSend();
    // 일정 시간(예: 600초) 후에 함수 멈추기
    Timer(Duration(seconds: 10), () {
      stopFunction();
    });
  }

  Timer timeSend() {
    return Timer.periodic(Duration(milliseconds: (500)), (timer) {
      // 1초에 30번 실행되는 함수 호출
      takePicture();
    });
  }

  void takePicture() async {
    final image = await cameraController.takePicture();
    final File file = File(image.path);
    final bytes = await file.readAsBytes();
    videoSocket.sendVideo(base64.encode(bytes));

    // 이전에 등록된 핸들러 제거
    videoSocket.socket.off("word");
    print("A@@@@A");

    // 새로운 핸들러 등록
    getSignLang();
  }

  void getSignLang() {
    videoSocket.socket.on("word", (data) {
      print("$data, @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      processData(data); // 데이터 처리 함수 호출
    });
  }

  void processData(data) async {
    final updatedTemp = List.from(temp); // temp 리스트를 복사하여 새로운 리스트 생성
    updatedTemp.add(data); // 새로운 데이터를 추가

    print('$data @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@98@@@@');
    print(
        '${data.runtimeType} @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    print("$what @@@@@@@@@@@");
    print("&&&&@@@@&&&&&&&&&");
    print("$temp, @@@@");

    setState(() {
      temp = updatedTemp; // 업데이트된 리스트로 temp 변수를 갱신
    });
  }

  void stopImageStream() {
    if (isStreamingImages) {
      setState(() {
        isStreamingImages = false;
      });
      cameraController.stopImageStream();
    }
  }

  Future<void> processCameraImage(CameraImage image) async {
    final img.Image convertedImage = img.Image.fromBytes(
      width: image.planes[0].width as int,
      height: image.planes[0].height as int,
      bytes: image.planes[0].bytes as ByteBuffer,
    );

    final List<int> imageBytes = img.encodePng(convertedImage);
    final String base64Image = base64Encode(imageBytes);

    videoSocket.sendVideo(base64Image);
  }

  @override
  Widget build(BuildContext context) {
    if (!cameraController.value.isInitialized) {
      return Container();
    }
    return Scaffold(
      appBar: CustomAppBarInner(name: "수어 인식"),
      body: Column(
        children: [
          TextButton(
              onPressed: () {
                setState(() {
                  print("아");
                  print("$temp @@@@@@@@@@@@@@@@@");
                });
              },
              child: Text(what)),
          SizedBox(
            height: 50,
            child: ListView.separated(
              separatorBuilder: (context, index) => SizedBox(
                width: 10,
              ),
              scrollDirection: Axis.horizontal,
              itemCount: temp.length,
              itemBuilder: (context, index) {
                var sample = temp[index];
                return Text(
                  sample,
                  style: TextStyle(fontSize: 28),
                );
              },
            ),
          ),
          AspectRatio(
            aspectRatio: 2 / 3,
            child: CameraPreview(cameraController),
          ),
          // CameraPreview(cameraController),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: isStreamingImages
            ? stopImageStream
            : () async {
                setState(() {
                  temp = [];
                });
                startSend();
              },
        child: Icon(isStreamingImages ? Icons.stop : Icons.videocam),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}
