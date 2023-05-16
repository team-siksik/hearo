import React, { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const sendWorker = new Worker("sendAudio.js");

    sendWorker.onmessage = (e) => {
      console.log(e.data);
    };

    sendWorker.postMessage({ message: "sendAudio" });

    navigator.mediaDevices.getUserMedia({ audio: true }).then((mediaStream) => {
      const audioTrack = mediaStream.getAudioTracks()[0];
      sendWorker.postMessage({ audioTrack });
    });

    // const receiveWorker = new Worker("receiveAudio.js");
    // receiveWorker.onmessage = (e) => {
    //   console.log(e.data);
    // };
    // receiveWorker.postMessage({ message: "receiveAudio" });

    return () => {
      sendWorker.terminate();
      // receiveWorker.terminate();
    };
  }, []);

  return (
    <div className="App">
      <h1>Diart Test</h1>
    </div>
  );
}

export default App;
