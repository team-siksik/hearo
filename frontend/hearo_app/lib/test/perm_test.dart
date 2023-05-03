import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

class PermTest extends StatefulWidget {
  const PermTest({super.key});

  @override
  State<PermTest> createState() => _PermTestState();
}

getPermissionCamera() async {
  var statusCamera = await Permission.camera.status;
  if (statusCamera.isGranted) {
    print('허락됨1camera');
  } else if (statusCamera.isDenied) {
    print('거절됨1camera');
    Permission.camera.request();
  }
}

getPermissionAudio() async {
  var statusMicrophone = await Permission.microphone.status;
  if (statusMicrophone.isGranted) {
    print('허락됨2microphone');
  } else if (statusMicrophone.isDenied) {
    print('거절됨2microphone');
    Permission.microphone.request();
  }
}

getPermission() async {
  var statusAudio = await Permission.audio.status;
  if (statusAudio.isGranted) {
    print('허락됨3audio');
  } else if (statusAudio.isDenied) {
    print('거절됨3audio');
    Permission.audio.request();
  }
  if (statusAudio.isPermanentlyDenied) {
    openAppSettings();
  }
}

class _PermTestState extends State<PermTest> {
  @override
  void initState() {
    super.initState();
    // getPermissionCamera();
    getPermissionAudio();
    // getPermission();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("권한테스트")),
      body: Center(child: Text("권한바디")),
    );
  }
}
