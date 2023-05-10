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
const ERR_NETWORK = 2;
const ERR_AUDIO = 3;
const ERR_SERVER = 4;
const ERR_CLIENT = 5;

// Event codes
const MSG_WAITING_MICROPHONE = 1;
const MSG_MEDIA_STREAM_CREATED = 2;
const MSG_INIT_RECORDER = 3;
const MSG_RECORDING = 4;
const MSG_SEND = 5;
const MSG_SEND_EMPTY = 6;
const MSG_SEND_EOS = 7;
const MSG_WEB_SOCKET = 8;
const MSG_WEB_SOCKET_OPEN = 9;
const MSG_WEB_SOCKET_CLOSE = 10;
const MSG_STOP = 11;
const MSG_SERVER_CHANGED = 12;
const MSG_AUDIOCONTEXT_RESUMED = 13;

export default function STTTest() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaStream, setMediaStream] = useState<MediaStream>(); //streaming되는 미디어
  const [audioArray, setAudioArray] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob>();
  const [recorder, setRecorder] = useState<MediaRecorder>(); // 녹음기
  const [subRecorder, setSubRecorder] = useState<Recorder>();
  const [audio, setAudio] = useState<string>(); //whole audio blob url
  const [roomSeq, setRoomSeq] = useState<number>();
  const [socket, setSocket] = useState<Socket>();

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
      autoConnect: false,
      transports: ["websocket"],
      path: "/ws/socket.io",
    });

    setSocket(socket);
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
  function sendMessage() {
    if (socket && audioBlob) {
      socket.emit("send_audio", { audio: audioBlob });
    }
  }

  // recording stop
  function stopRecord() {
    if (recorder && isRecording) {
      recorder.stop();
    }
    setIsRecording(false);
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
      <button onClick={sendMessage}>socket으로 메시지 보내기</button>
      {audio && <audio src={audio} controls />}
    </div>
  );
}
