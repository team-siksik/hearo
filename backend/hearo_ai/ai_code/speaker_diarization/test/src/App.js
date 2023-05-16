// def run():
//     parser = argparse.ArgumentParser()
//     parser.add_argument("source", type=str, help="Path to an audio file | 'microphone' | 'microphone:<DEVICE_ID>'")
//     parser.add_argument("--host", required=True, type=str, help="Server host")
//     parser.add_argument("--port", required=True, type=int, help="Server port")
//     parser.add_argument("--step", default=0.5, type=float, help=f"{argdoc.STEP}. Defaults to 0.5")
//     parser.add_argument("-sr", "--sample-rate", default=16000, type=int, help=f"{argdoc.SAMPLE_RATE}. Defaults to 16000")
//     parser.add_argument("-o", "--output-file", type=Path, help="Output RTTM file. Defaults to no writing")
//     args = parser.parse_args()

//     # Run websocket client
//     ws = WebSocket()
//     ws.connect(f"ws://{args.host}:{args.port}")
//     sender = Thread(target=send_audio, args=[ws, args.source, args.step, args.sample_rate])
//     receiver = Thread(target=receive_audio, args=[ws, args.output_file])
//     sender.start()
//     receiver.start()


import React, { useEffect } from "react";
import './App.css';

function App() {

  
  useEffect(() => {
    
    const sendWorker = new Worker("sendAudio.js");
    sendWorker.onmessage = (e) => {
      console.log(e.data);
    };
    sendWorker.postMessage("hi");

    const receiveWorker = new Worker("receiveAudio.js");
    receiveWorker.onmessage = (e) => {
      console.log(e.data);
    };
    receiveWorker.postMessage("hi");

    return () => {
      sendWorker.terminate();
      receiveWorker.terminate();
    };
  }, []);

  return (
    <div className="App">
      <h1>Diart Test</h1>
    </div>
  );
}

export default App;
