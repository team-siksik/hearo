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
  final SocketOverall videoSocket = SocketOverall();
  late List<CameraDescription> cameras;
  late CameraController cameraController;
  bool isStreamingImages = false;

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
    videoSocket.closeRoom();
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

  void startSend() {
    setState(() {
      isStreamingImages = true;
    });
    Timer timer = timeSend();

    // 일정 시간(예: 600초) 후에 함수 멈추기
    Timer(Duration(seconds: 600), () {
      stopFunction(timer);
    });
  }

  Timer timeSend() {
    return Timer.periodic(Duration(milliseconds: (1000 ~/ 30)), (timer) {
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
      videoSocket.sendVideo(encodedImage);
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
          AspectRatio(
            aspectRatio: 1 / 1,
            child: CameraPreview(cameraController),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: isStreamingImages ? stopImageStream : startSend,
        child: Icon(isStreamingImages ? Icons.stop : Icons.videocam),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}
