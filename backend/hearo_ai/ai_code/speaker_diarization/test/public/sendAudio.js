// def send_audio(ws: WebSocket, source: Text, step: float, sample_rate: int):
//     # Create audio source
//     block_size = int(np.rint(step * sample_rate))
//     source_components = source.split(":")
//     if source_components[0] != "microphone":
//         audio_source = src.FileAudioSource(source, sample_rate)
//     else:
//         device = int(source_components[1]) if len(source_components) > 1 else None
//         audio_source = src.MicrophoneAudioSource(sample_rate, block_size, device)

//     # Encode audio, then send through websocket
//     audio_source.stream.pipe(
//         ops.map(utils.encode_audio)
//     ).subscribe_(ws.send)

//     # Start reading audio
//     audio_source.read()


onmessage = (e) => {
  const ws = new WebSocket("ws://k8a6031.p.ssafy.io:8000/");
  
  ws.onopen = () => {
    ws.send("Hello from sendAudio.js");
  };

  ws.onmessage = (event) => {
    postMessage(event.data);
  };

  ws.onclose = () => {
    // WebSocket 연결이 닫힐 때 처리할 내용
  };

  ws.onerror = (error) => {
    // WebSocket 오류 발생 시 처리할 내용
  };
};
