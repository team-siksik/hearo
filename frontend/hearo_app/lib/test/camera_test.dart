import 'dart:convert';
import 'dart:typed_data';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:hearo_app/skills/socket_overall.dart';
import 'dart:io';

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

  void startCameraRecording() async {
    // 영상 녹화 시작
    await cameraController.startVideoRecording();

    // 녹화가 시작되었으므로 isRecording 값을 true로 설정합니다.
    setState(() {
      isRecording = true;
    });

    // 카메라 프레임을 받아서 자동으로 캡쳐하는 로직을 추가합니다.
    cameraController.startImageStream((CameraImage image) async {
      // 촬영된 영상을 자동으로 캡쳐하기 위해 takePicture() 메서드를 사용합니다.
      XFile picture = await cameraController.takePicture();

      // do something with the captured picture
    });
  }

  void stopCameraRecording() async {
    // 영상 녹화 중지
    await cameraController.stopVideoRecording();

    // 녹화가 중지되었으므로 isRecording 값을 false로 설정합니다.
    setState(() {
      isRecording = false;
    });

    // 카메라 프레임을 더 이상 받지 않도록 설정합니다.
    cameraController.stopImageStream();
  }

  @override
  void initState() {
    startCamera();
    videoSocket.connect();
    videoSocket.enterRoom("1111");
    super.initState();
  }

  void startCamera() async {
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

  Uint8List _readVideoAsBytes(String filePath) {
    final File file = File(filePath);
    return file.readAsBytesSync();
  }

  String _convertVideoToBase64(String filePath) {
    final bytes = _readVideoAsBytes(filePath);
    return base64Encode(bytes);
  }

  @override
  void dispose() {
    cameraController.dispose();
    videoSocket.closeRoom("1111");
    videoSocket.disconnect();
    super.dispose();
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
