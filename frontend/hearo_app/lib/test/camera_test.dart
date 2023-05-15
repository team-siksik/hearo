import 'dart:async';
import 'dart:convert';
import 'dart:isolate';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:hearo_app/skills/socket_overall.dart';

/// CameraTest is the Main Application.
class CameraTest extends StatefulWidget {
  /// Default Constructor
  const CameraTest({super.key});

  @override
  State<CameraTest> createState() => _CameraTestState();
}

class _CameraTestState extends State<CameraTest> {
  final SocketOverall videoSocket = SocketOverall();
  late List<CameraDescription> cameras;
  late CameraController cameraController;
  bool isRecording = false;
  late ReceivePort _receivePort;

  @override
  void initState() {
    startCamera();
    videoSocket.connect();
    videoSocket.enterRoom();
    super.initState();
  }

  @override
  void dispose() {
    cameraController.dispose();
    videoSocket.closeRoom();
    videoSocket.disconnect();
    super.dispose();
  }

  Future<void> startCamera() async {
    cameras = await availableCameras();
    late CameraDescription frontCamera;
    for (final camera in cameras) {
      if (camera.lensDirection == CameraLensDirection.front) {
        frontCamera = camera;
        break;
      }
    }

    cameraController = CameraController(
      frontCamera,
      ResolutionPreset.low,
      enableAudio: false,
    );
    await cameraController.initialize().then((value) {
      if (!mounted) {
        return;
      }
      setState(() {});
    });
  }

  void startCameraRecording() async {
    // 영상 녹화 시작
    await cameraController.startVideoRecording();

    // 녹화가 시작되었으므로 isRecording 값을 true로 설정합니다.
    setState(() {
      isRecording = true;
    });

    // 카메라 이미지 캡처를 시작합니다.
    _receivePort = ReceivePort();
    await Isolate.spawn(
        _startCapturingFrames, CameraIsolate(cameraController, videoSocket),
        onExit: _receivePort.sendPort);

    // 이미지 캡처 isolate로부터 메시지를 받아 처리합니다.
    _receivePort.listen((message) {
      if (message is String) {
        print("Received message: $message");
      }
    });
  }

  void _startCapturingFrames(CameraIsolate isolate) async {
    while (isRecording) {
      try {
        final image = await cameraController.takePicture();
        final base64Image = base64Encode(await image.readAsBytes());
        videoSocket.sendVideo(base64Image);
      } catch (e) {
        print("Error capturing frame: $e");
      }
      await Future.delayed(Duration(milliseconds: 33));
    }
  }

  void stopCameraRecording() async {
    await cameraController.stopVideoRecording();
    setState(() {
      isRecording = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (cameraController.value.isInitialized) {
      return Scaffold(
        appBar:
            AppBar(title: Title(color: Colors.black, child: Text("카메라 테스트"))),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            AspectRatio(
                aspectRatio: 1 / 1, child: CameraPreview(cameraController)),
            Text(isRecording ? "촬영 중" : "촬영 대기 중")
          ],
        ),
        floatingActionButton: FloatingActionButton(
          backgroundColor: isRecording ? Color(0xffe63e43) : Colors.blueAccent,
          onPressed: isRecording ? stopCameraRecording : startCameraRecording,
          child: Icon(isRecording ? Icons.stop : Icons.videocam),
        ),
      );
    }
    return const SizedBox();
  }
}

class CameraIsolate {
  static const int _TIMER_DELAY = 33; // 30 fps
  final CameraController cameraController;
  final SocketOverall videoSocket;

  CameraIsolate(this.cameraController, this.videoSocket);

  void startCapturingFrames() async {
    while (true) {
      // 33ms(30fps) 대기합니다.
      await Future.delayed(Duration(milliseconds: _TIMER_DELAY));

      // 촬영 중이 아니면 반복을 중지합니다.
      if (!cameraController.value.isRecordingVideo) {
        break;
      }

      try {
        // 이미지 캡처를 시작합니다.
        XFile file = await cameraController.takePicture();

        // 파일을 읽어서 base64로 인코딩합니다.
        String base64Image = base64Encode(await file.readAsBytes());

        // 소켓으로 이미지를 전송합니다.
        videoSocket.sendVideo(base64Image);
      } catch (e) {
        print("Error capturing frame: $e");
      }
    }
  }
}
