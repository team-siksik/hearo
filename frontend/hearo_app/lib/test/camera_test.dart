import 'package:camera/camera.dart';
import 'package:flutter/material.dart';

/// CameraTest is the Main Application.
class CameraTest extends StatefulWidget {
  /// Default Constructor
  const CameraTest({super.key});

  @override
  State<CameraTest> createState() => _CameraTestState();
}

class _CameraTestState extends State<CameraTest> {
  late List<CameraDescription> cameras;
  late CameraController cameraController;

  @override
  void initState() {
    startCamera();
    super.initState();
  }

  void startCamera() async {
    cameras = await availableCameras();

    cameraController = CameraController(
      cameras[0],
      ResolutionPreset.low,
      enableAudio: false,
    );

    await cameraController.initialize().then((value) {
      if (!mounted) {
        return;
      }
      setState(() {});
    }).catchError((e) {
      print(e);
    });
  }

  @override
  void dispose() {
    cameraController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (cameraController.value.isInitialized) {
      return Scaffold(
        appBar:
            AppBar(title: Title(color: Colors.black, child: Text("카메라 테스트"))),
        body: Stack(children: [CameraPreview(cameraController)]),
      );
    }
    return const SizedBox();
  }
}
