// def receive_audio(ws: WebSocket, output: Optional[Path]):
//     while True:
//         message = ws.recv()
//         print(f"Received: {message}", end="")
//         if output is not None:
//             with open(output, "a") as file:
//                 file.write(message)


onmessage = (e) => {
    const ws = new WebSocket("ws://k8a6031.p.ssafy.io:8000/");
    
    ws.onopen = () => {
      ws.send("Hello from receiveAudio.js");
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
