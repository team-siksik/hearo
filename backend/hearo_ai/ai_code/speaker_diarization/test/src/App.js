import React, { useEffect } from "react";
import "./App.css";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

class SimpleQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(item) {
    this.queue.push(item);
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  size() {
    return this.queue.length;
  }
}

class MicrophoneAudioSource {
  constructor(sampleRate, blockSize) {
    this.uri = "live_recording";
    this.sampleRate = sampleRate;
    this.blockSize = blockSize;
    this.stream = new Subject();
    this._queue = new SimpleQueue();
    this._micStream = null;
    this.initialize();
  }

  initialize() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.log(stream);
        const audioContext = new AudioContext();
        audioContext.audioWorklet
          .addModule("audio-processor.js")
          .then(() => {
            const audioSourceNode =
              audioContext.createMediaStreamSource(stream);
            const audioWorkletNode = new AudioWorkletNode(
              audioContext,
              "audio-processor"
            );

            audioSourceNode.connect(audioWorkletNode);
            audioWorkletNode.connect(audioContext.destination);
          })
          .catch((error) => {
            console.error("Failed to add audio worklet module:", error);
          });

        this._micStream = stream;
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  }

  _readCallback(samples, ...args) {
    this._queue.enqueue(samples.getChannelData(0));
  }

  read() {
    if (this._micStream) {
      const audioTracks = this._micStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const audioTrack = audioTracks[0];
        if (audioTrack.readyState === "live") {
          const readLoop = () => {
            while (!this._queue.isEmpty()) {
              const samples = this._queue.dequeue();
              this.stream.next(samples);
            }

            if (audioTrack.readyState !== "live") {
              this.stream.complete();
              this.close();
              return;
            }

            setTimeout(readLoop, 0);
          };

          readLoop();
        }
      }
    }
  }

  close() {
    if (this._micStream) {
      const audioTracks = this._micStream.getAudioTracks();
      audioTracks.forEach((audioTrack) => {
        audioTrack.stop();
      });
      this._micStream.getTracks().forEach((audioTrack) => {
        audioTrack.stop();
      });
    }
  }
}

function encodeAudio(waveform) {
  const buffer = new Uint8Array(waveform.buffer);
  let binary = "";
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  const base64 = btoa(binary);
  console.log(base64);
  return base64;
}

function App() {
  // sendAudio
  const ws = new WebSocket("ws://k8a6031.p.ssafy.io:7007/");

  const step = 0.5;
  const sampleRate = 16000;
  const blockSize = Math.round(step * sampleRate);
  const audioSource = new MicrophoneAudioSource(sampleRate, blockSize);

  console.log(audioSource);
  audioSource.stream.pipe(map(encodeAudio)).subscribe((data) => {
    ws.send(data);
  });
  audioSource.read();

  ws.onopen = () => {
    console.log("sendAudio opened");
  };

  ws.onclose = () => {
    console.log("sendAudio closed");
  };

  ws.onerror = (error) => {
    console.log("sendAudio error: " + error.message);
  };

  useEffect(() => {
    // const sendWorker = new Worker("sendAudio.js");
    // sendWorker.onmessage = (e) => {
    //   console.log(e.data);
    // };
    // sendWorker.postMessage({ message: "sendAudio" });

    // const receiveWorker = new Worker("receiveAudio.js");
    // receiveWorker.onmessage = (e) => {
    //   console.log(e.data);
    // };
    // receiveWorker.postMessage({ message: "receiveAudio" });

    return () => {
      // sendWorker.terminate();
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
