import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:hearo_app/skills/socket_overall.dart';
import 'package:image/image.dart' as img;

/// Camera2는 메인 애플리케이션입니다.
class Camera2 extends StatefulWidget {
  /// 기본 생성자
  const Camera2({Key? key}) : super(key: key);

  @override
  State<Camera2> createState() => _Camera2State();
}

class _Camera2State extends State<Camera2> {
  final SocketOverall videoSocket = SocketOverall();
  late List<CameraDescription> cameras;
  late CameraController cameraController;
  bool isStreamingImages = false;
  Timer? imageStreamingTimer; // Timer 객체를 저장하기 위한 변수
  GlobalKey globalKey = GlobalKey();

  @override
  void initState() {
    videoSocket.connect();
    videoSocket.enterRoom("1111");

    availableCameras().then((availableCameras) {
      cameras = availableCameras;
      late CameraDescription frontCamera;
      for (final camera in cameras) {
        if (camera.lensDirection == CameraLensDirection.front) {
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
    cameraController.dispose();
    videoSocket.closeRoom("1111");
    videoSocket.disconnect();
    super.dispose();
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

  void startStreaming() async {
    isStreamingImages = true;
    if (!cameraController.value.isStreamingImages) {
      await cameraController.startImageStream((CameraImage image) async {
        if (isStreamingImages) {
          String base64Image = base64Encode(image.planes[0].bytes);
          await videoSocket.sendVideo("image", base64Image);
        }
      });
    }
  }

  void stopStreaming() {
    if (cameraController.value.isStreamingImages) {
      cameraController.stopImageStream();
      isStreamingImages = false;
    }
  }

  void startSend() {
    setState(() {
      isStreamingImages = true;
    });
    Timer timer = timeSend();

    // 일정 시간(예: 10초) 후에 함수 멈추기
    Timer(Duration(seconds: 5), () {
      stopFunction(timer);
    });
  }

  Timer timeSend() {
    return Timer.periodic(Duration(milliseconds: 30), (timer) {
      // 1초에 30번 실행되는 함수 호출
      takePicture();
    });
  }

  void takePicture() async {
    try {
      final image = await cameraController.takePicture();
      final File file = File(image.path);
      final bytes = await file.readAsBytes();
      final encodedImage = base64.encode(bytes);
      await videoSocket.sendVideo("1111", encodedImage);
    } catch (e) {
      print(e);
    }
  }

  void stopFunction(Timer timer) {
    setState(() {
      isStreamingImages = false;
    });
    timer.cancel();
    print('함수가 멈추었습니다.');
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

    videoSocket.sendVideo('1111', base64Image);
  }

  @override
  Widget build(BuildContext context) {
    if (!cameraController.value.isInitialized) {
      return Container();
    }
    return Scaffold(
      appBar: AppBar(title: Text("영상 소켓 테스트")),
      body: Column(
        children: [
          AspectRatio(
            aspectRatio: 1 / 1,
            child: CameraPreview(cameraController),
          ),
          ElevatedButton(
            onPressed: takePicture,
            child: Text('Take Picture'),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        // onPressed: isStreamingImages ? stopImageStream : startSend,
        onPressed: isStreamingImages ? stopStreaming : startStreaming,
        child: Icon(isStreamingImages ? Icons.stop : Icons.videocam),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.miniEndFloat,
    );
  }
}
