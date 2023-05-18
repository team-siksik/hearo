import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hearo_app/controller/sign_controller.dart';
import 'package:hearo_app/skills/socket_overall.dart';
import 'package:hearo_app/widgets/common/custom_app_bar_inner.dart';

class SignLang extends StatefulWidget {
  const SignLang({Key? key}) : super(key: key);

  @override
  State<SignLang> createState() => _SignLangState();
}

class _SignLangState extends State<SignLang> {
  bool isCameraOn = false;
  late Timer timer;
  final SocketOverall videoSocket = SocketOverall();
  late List<CameraDescription> cameras;
  late CameraController cameraController;
  bool isStreamingImages = false;
  bool isLoading = false;
  String what = '카메라 버튼을 눌러 인식 시작';
  SignContoller signContoller = Get.put(SignContoller());

  @override
  void initState() {
    videoSocket.connect();
    videoSocket.enterRoom();
    videoSocket.socket.on(
      "word",
      (data) {
        signContoller.addSigns(data);
      },
    );
    signContoller.signs.value = [];
    availableCameras().then((availableCameras) {
      cameras = availableCameras;
      late CameraDescription frontCamera;
      for (final camera in cameras) {
        if (camera.lensDirection == CameraLensDirection.back) {
          frontCamera = camera;
          break;
        }
      }
      cameraController = CameraController(frontCamera, ResolutionPreset.medium);

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

  void startSend() {
    setState(() {
      isStreamingImages = true;
    });

    // 일정 시간(예: 600초) 후에 함수 멈추기
    Timer(Duration(seconds: 10), () {
      stopFunction();
      setState(() {
        isCameraOn = false;
        isLoading = false;
      });
    });

    timer = timeSend();
  }

  Timer timeSend() {
    return Timer.periodic(Duration(milliseconds: 600), (timer) {
      takePicture();
    });
  }

  void takePicture() async {
    final image = await cameraController.takePicture();
    final File file = File(image.path);
    final bytes = await file.readAsBytes();
    videoSocket.sendVideo(base64.encode(bytes));
  }

  Future<void> getSignLang() async {
    await Future.delayed(Duration.zero); // 다음 프레임에서 실행되도록 미세 지연을 추가합니다.

    videoSocket.socket.on("word", (data) {
      processData(data);
      setState(() {});
    });
  }

  void processData(data) async {
    signContoller.addSigns(data);
  }

  void stopImageStream() {
    if (isStreamingImages) {
      setState(() {
        isStreamingImages = false;
        isCameraOn = false;
      });
      cameraController.stopImageStream();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!cameraController.value.isInitialized) {
      return Container();
    }
    return Scaffold(
      appBar: CustomAppBarInner(name: "수어 인식"),
      body: !isCameraOn
          ? Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.video_camera_front_rounded,
                        color: Colors.blueAccent,
                        size: 30,
                      ),
                      Text(
                        "을 눌러 수어 인식 시작",
                        style: TextStyle(fontSize: 20),
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  Text(
                    "인식 단어 목록",
                    style: TextStyle(fontSize: 24),
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  isLoading
                      ? Padding(
                          padding: const EdgeInsets.all(50),
                          child: SizedBox(
                              height: 150,
                              width: 150,
                              child: CircularProgressIndicator()),
                        )
                      : SizedBox(
                          height: 300,
                          child: ListView.separated(
                            separatorBuilder: (context, index) => SizedBox(
                              width: 10,
                            ),
                            itemCount: signContoller.signs.value.length,
                            itemBuilder: (context, index) {
                              var sample = signContoller.signs.value[index];
                              return Text(
                                sample,
                                style: TextStyle(fontSize: 28),
                              );
                            },
                          ),
                        ),
                ])
          : CameraPreview(cameraController),
      floatingActionButton: FloatingActionButton(
        onPressed: isStreamingImages
            ? stopImageStream
            : () async {
                setState(() {
                  isLoading = true;
                });
                await Future.delayed(Duration(seconds: 2));
                setState(() {
                  isCameraOn = true;
                  signContoller.signs.value = [];
                });
                startSend();
              },
        child: Icon(
            isStreamingImages ? Icons.stop : Icons.video_camera_front_outlined),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}
