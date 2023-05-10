import { Recorder } from "@/STT/recorder";
import { MeetingAPI } from "@/apis/api";
import React, { useState } from "react";
import { Socket, io } from "socket.io-client";

//FIXME: accessToken 연결 전 수정해야함
const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJub2hoeXVuamVvbmc5M0BnbWFpbC5jb20iLCJpYXQiOjE2ODM2OTE4NTIsImV4cCI6MTY4MzcxMzQ1Mn0.DrWzRuqOQozjXDntP43aZSZp5X2SA8qMSzJIyv8P9QQ";

const socketURl = "http://ubuntu@k8a6031.p.ssafy.io:80";
const recorderWorkerPath = "@/STT/recorder.ts";

// Error codes (mostly following Android error names and codes)
const ERR_SOCKET = 1;
const ERR_NETWORK = 2;
const ERR_AUDIO = 3;
const ERR_SERVER = 4;
const ERR_CLIENT = 5;

// Event codes
const MSG_WAITING_MICROPHONE = 1;
const MSG_MEDIA_STREAM_CREATED = 2;
const MSG_INIT_RECORDER = 3;
const MSG_RECORDING = 4;
const AUDIO_SEND = 5;
const MSG_SEND_EMPTY = 6;
const MSG_SEND = 7;
const MSG_WEB_SOCKET = 8;
const MSG_WEB_SOCKET_OPEN = 9;
const MSG_WEB_SOCKET_CLOSE = 10;
const MSG_STOP = 11;
const MSG_SERVER_CHANGED = 12;
const MSG_AUDIOCONTEXT_RESUMED = 13;

export default function STTTest() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [intervalKey, setIntervalKey] = useState<any>();
  const [mediaStream, setMediaStream] = useState<MediaStream>(); //streaming되는 미디어

  const [audioArray, setAudioArray] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob>();

  const [recorder, setRecorder] = useState<MediaRecorder>(); // 녹음기
  const [subRecorder, setSubRecorder] = useState<Recorder>(); // worker recorder
  const [audio, setAudio] = useState<string>(); //whole audio blob url
  const [roomSeq, setRoomSeq] = useState<number>();
  const [socket, setSocket] = useState<Socket | null>();

  function onEvent(code: any, data: any) {
    console.log(`msg: ${code} : ${data || ""}\n`);
  }
  function onError(code: any, data: any) {
    console.log(`Error: ${code} : ${data}\n`);
  }

  //TODO: start meeting api 통신
  //TODO: start meeting socket io 방 열기
  //TODO: start record

  function createSocket() {
    const socket = io(socketURl, {
      reconnectionDelayMax: 10000,
      //   autoConnect: false,
      transports: ["websocket"],
      path: "/ws/socket.io",
    });

    //TODO: server에서 보내주는 메시지 형식이나 내용에 대해서 이야기 해봐야 할 듯
    // message 라는 이벤트 메시지를 받았을 때
    socket.on("message", (e) => {
      const { data } = e;
      onEvent(MSG_WEB_SOCKET, data);
      // socket server에서 보낸 데이터가 object일 때
      if (data instanceof Object && !(data instanceof Blob)) {
        onError(ERR_SERVER, "WebSocket: onEvent: got Object, not a Blob");
      }
      // socket server에서 보낸 데이터가 blob일 때
      else if (data instanceof Blob) {
        onError(ERR_SERVER, "WebSocket: got Blob");
      }
      // socket server에서 보낸 데이터가 string이나 나머지일 때
      else {
        const response = JSON.parse(data);
        console.log(response);
      }
    });

    // info 라는 이벤트 메시지를 받았을 때
    socket.on("info", (e) => {
      const { data } = e;
      onEvent(MSG_WEB_SOCKET, data);
      // socket server에서 보낸 데이터가 object일 때
      if (data instanceof Object && !(data instanceof Blob)) {
        onError(ERR_SERVER, "WebSocket: onEvent: got Object, not a Blob");
      }
      // socket server에서 보낸 데이터가 blob일 때
      else if (data instanceof Blob) {
        onError(ERR_SERVER, "WebSocket: got Blob");
      }
      // socket server에서 보낸 데이터가 string이나 나머지일 때
      else {
        const response = JSON.parse(data);
        console.log(response);
      }
    });

    // start recording if socket is connected
    socket.on("connect", () => {
      const intervalKey = setInterval(() => {
        subRecorder?.exportWAV((blob: Blob) => {
          socketSend(blob);
          subRecorder?.clear();
        }, "audio/wav");
      }, 250);
      setIntervalKey(intervalKey);
      subRecorder?.record();
      console.log("ready for speech");
      onEvent(MSG_WEB_SOCKET_OPEN, "socket_open");
    });

    socket.on("disconnect", (e) => {
      console.log("web socket closed");
      onEvent(MSG_WEB_SOCKET_CLOSE, e);
    });

    socket.on("error", (e) => {
      onEvent(ERR_SOCKET, e);
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    setSocket(socket);

    return socket;
  }

  async function record() {
    // 마이크 mediaStream 생성: Promise를 반환하므로 async/await 사용
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    setMediaStream(mediaStream);
    // audioContext 생성 (Web Audio API 는 모든 작업을 AudioContext 내에서 처리한다.)
    const audioContext = new AudioContext({ sampleRate: 16000 });
    const input: MediaStreamAudioSourceNode =
      audioContext.createMediaStreamSource(mediaStream);

    setIsRecording(true);

    //TODO: 이렇게 recorder를 두개 만들어야 할까 ?
    // socket으로 보내는 recorder
    const recorder = new Recorder(input, {
      workerPath: { recorderWorkerPath },
    });
    setSubRecorder(recorder);

    // MediaRecorder 생성
    const mediaRecorder = new MediaRecorder(mediaStream);
    onEvent(MSG_INIT_RECORDER, "Recorder initialized");
    setRecorder(mediaRecorder);

    // 이벤트핸들러: 녹음 데이터 취득 처리
    mediaRecorder.ondataavailable = (event) => {
      audioArray.push(event.data); // 오디오 데이터가 취득될 때마다 배열에 담아둔다.
    };

    // 이벤트핸들러: 녹음 종료 처리 & 재생하기
    mediaRecorder.onstop = () => {
      // 녹음이 종료되면, 배열에 담긴 오디오 데이터(Blob)들을 합친다: 코덱도 설정해준다.
      const blob = new Blob(audioArray, { type: "audio/wav codecs=opus" });
      setAudioBlob(blob);
      audioArray.splice(0); // 기존 오디오 데이터들은 모두 비워 초기화한다.
      // Blob 데이터에 접근할 수 있는 주소를 생성한다.
      const blobURL = window.URL.createObjectURL(blob);
      setAudio(blobURL);
    };

    // 녹음 시작
    mediaRecorder.start();
    setIsRecording(true);

    return mediaRecorder;
  }

  // recording start
  function startRecord() {
    onEvent(
      MSG_WAITING_MICROPHONE,
      "Waiting for approval to access your microphone ..."
    );
    if (recorder) {
      return;
    }
    if (socket) {
      cancel();
      return;
    }

    if (!isRecording) {
      // const accessToken = localStorage.getItem("accessToken");

      MeetingAPI.startMeeting(accessToken!)
        .then((result) => {
          console.log(result);
          setRoomSeq(result.data.data.roomSeq); // roomSequence
          createSocket();
          record();
        })
        .catch((err) => {
          onError(ERR_CLIENT, `No user media support, ${err}`);
        });
    }
  }
  function socketSend(item: any) {
    if (socket && socket.connected) {
      // If item is an audio blob
      if (item instanceof Blob) {
        if (item.size > 0) {
          socket.emit("audio", { audio: item });
          onEvent(AUDIO_SEND, `Send: blob: ${item.type}, ${item.size}`);
        } else {
          onEvent(MSG_SEND_EMPTY, `Send: blob: ${item.type}, EMPTY`);
        }
        //If item is like string or sth
      } else {
        socket.emit("message", { message: item });
        onEvent(MSG_SEND, `Send tag: ${item}`);
      }
    } else {
      onError(ERR_CLIENT, `No web socket connection: failed to send: ${item}`);
    }
  }

  // recording stop
  function stopRecord() {
    // Stop the regular sending of audio
    // clearInterval(intervalKey);

    // Stop recording
    if (recorder && isRecording && subRecorder) {
      try {
        recorder.stop();
      } catch {
        console.log("recorder stop error");
      }
      subRecorder.stop();
      onEvent(MSG_STOP, "Stopped recording");

      // Push the remaining audio to the server
      subRecorder.exportWAV((blob: Blob) => {
        // socket send audio
        //   socketSend(blob);
        // socket send recording finish sign
        //   socketSend('finish_audio');
        subRecorder.clear();
      }, "audio/wav");
      console.log("end of meeting");

      // 녹음 완전히 종료
      if (mediaStream !== undefined) {
        const tracks = mediaStream!.getTracks();
        if (tracks !== undefined) {
          tracks.forEach((track) => {
            track.stop();
          });
        }
      }
      setIsRecording(false);
    } else {
      onError(ERR_AUDIO, "Recorder undefined");
    }
  }

  function cancel() {
    // Stop the regular sending of audio (if present)
    //   clearInterval(intervalKey);
    if (subRecorder) {
      subRecorder.stop();
      subRecorder?.clear();
      onEvent(MSG_STOP, "Stopped recording");
    }
    if (socket) {
      socket.close();
      setSocket(null);
    }
  }

  function closeRoomAPI() {
    console.log(accessToken, roomSeq, audioBlob);
    MeetingAPI.finishMeeting(accessToken, roomSeq!, audioBlob!);
  }

  return (
    <div className="m-10 flex flex-col ">
      <p>녹음</p>
      <div className="flex flex-row">
        <button
          className="m-3 border-spacing-1 border border-blue-main"
          onClick={startRecord}
        >
          녹음 시작
        </button>
        <button
          className="m-3 border-spacing-1 border border-blue-main"
          onClick={stopRecord}
        >
          녹음 종료
        </button>
      </div>
      <button onClick={closeRoomAPI}>방 닫기</button>
      <button onClick={socketSend}>socket으로 메시지 보내기</button>
      {audio && <audio src={audio} controls />}
    </div>
  );
}
