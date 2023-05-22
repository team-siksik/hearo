import { Recorder } from "@/STT/recorder";
import { MeetingAPI } from "@/apis/api";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

//FIXME: accessToken 연결 전 수정해야함
const accessToken = sessionStorage.getItem("accessToken");

const socketURl = "http://k8a6031.p.ssafy.io:80/";
const recorderWorkerPath = "../STT/recorderWorker.js";
const roomNo = 1343;

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

interface PropsType {}

export default function STT({}: PropsType) {
  const [intervalKey, setIntervalKey] = useState<any>();
  const [mediaStream, setMediaStream] = useState<MediaStream>(); //streaming되는 미디어
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioArray, setAudioArray] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob>();
  // const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(); // 녹음기
  // const [subRecorder, setSubRecorder] = useState<any>(); // worker recorder
  const mediaRecorder = useRef<MediaRecorder>();
  const subRecorder = useRef<Recorder>();

  const [audio, setAudio] = useState<string>(); //whole audio blob url
  // meeting room no
  const [roomSeq, setRoomSeq] = useState<number>();
  // const [socket, setSocket] = useState<Socket | null>();
  const socket = useRef<Socket | null>(null);

  function onEvent(code: any, data: any) {
    console.log(`msg: ${code} : ${data || ""}\n`);
  }
  function onError(code: any, data: any) {
    console.log(`Error: ${code} : ${data}\n`);
  }

  function createSocket() {
    const socket = io(socketURl, {
      reconnectionDelayMax: 10000,
      //   autoConnect: false,
      transports: ["websocket"],
      path: "/ws/socket.io",
    });

    if (!socket) {
      throw new Error("socket error!");
    }

    // start recording if socket is connected
    socket.on("connect", () => {
      console.log("connected");
      socket.emit("enter_room", {
        room_id: roomNo, //FIXME: random room key로 들어감 추후 수정
      });
      console.log("enter_the_room");
      const intervalKey = setInterval(() => {
        subRecorder.current?.exportWAV((blob: Blob) => {
          socketSend(blob);
          subRecorder.current?.clear();
        }, "audio/wav");
      }, 250);
      setIntervalKey(intervalKey);
      try {
        subRecorder.current?.record();
        console.log("ready for speech");
      } catch (err) {
        console.log("subRecorder doesnt work");
      }
      onEvent(MSG_WEB_SOCKET_OPEN, "socket_open");
    });

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
        // const response = JSON.parse(data);
        console.log(data);
      }
    });

    // info 라는 이벤트 메시지를 받았을 때
    socket.on("info", (e) => {
      const data = e;
      // onEvent(MSG_WEB_SOCKET, data);
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
        // const response = JSON.parse(data);
        console.log(data);
      }
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

    //TODO: socket으로 보내는 recorder
    const subRecorder1 = new Recorder(input, {
      workerPath: { recorderWorkerPath },
    });
    // setSubRecorder(subRecorder);
    subRecorder.current = subRecorder1;

    // MediaRecorder 생성 - 전체 녹음하는 recorder
    const mediaRecorder1 = new MediaRecorder(mediaStream, {
      audioBitsPerSecond: 16000,
      // memiType: "audio/wav codecs=opus",
    });
    onEvent(MSG_INIT_RECORDER, "Recorder initialized");
    // setMediaRecorder(mediaRecorder);
    mediaRecorder.current = mediaRecorder1;

    // 이벤트핸들러: 녹음 데이터 취득 처리
    mediaRecorder1.ondataavailable = (event) => {
      audioArray.push(event.data); // 오디오 데이터가 취득될 때마다 배열에 담아둔다.
    };

    // 이벤트핸들러: 녹음 종료 처리 & 재생하기
    mediaRecorder1.onstop = () => {
      // 녹음이 종료되면, 배열에 담긴 오디오 데이터(Blob)들을 합친다: 코덱도 설정해준다.
      const blob = new Blob(audioArray, { type: "audio/wav codecs=opus" });
      setAudioBlob(blob);
      audioArray.splice(0); // 기존 오디오 데이터들은 모두 비워 초기화한다.
      // Blob 데이터에 접근할 수 있는 주소를 생성한다.
      const blobURL = window.URL.createObjectURL(blob);
      setAudio(blobURL);

      setIsRecording(false);
    };

    // 녹음 시작
    mediaRecorder1.start();
    setIsRecording(true);

    //audioContext.state가 'suspended'이면 재실행함 -> 반대로 'running'일 경우, suspend()함수로 일시정지 시킬 수 있음
    audioContext.resume().then(() => {
      onEvent(MSG_AUDIOCONTEXT_RESUMED, "Audio context resumed");
    });

    return mediaRecorder;
  }

  // recording start
  function startRecord() {
    onEvent(
      MSG_WAITING_MICROPHONE,
      "Waiting for approval to access your microphone ..."
    );
    if (mediaRecorder.current) {
      console.log(mediaRecorder.current);
      return;
    }
    if (socket.current) {
      console.log(socket.current);
      cancel();
      return;
    }

    if (!isRecording) {
      // const accessToken = sessionStorage.getItem("accessToken");
      MeetingAPI.startMeeting(accessToken!)
        .then((result) => {
          setRoomSeq(result.data.data.roomSeq); // roomSequence
          record()
            .then((response) => {
              createSocket();
            })
            .catch((error) => {
              onError(ERR_AUDIO, "Recorder undefined");
            });
        })
        .catch((err) => {
          onError(ERR_CLIENT, `No user media support, ${err}`);
        });
    }
  }

  function socketSend(item: any) {
    if (socket) {
      // If item is an audio blob
      if (item instanceof Blob) {
        if (item.size > 0) {
          socket.current?.emit("audio", { audio: item });
          onEvent(AUDIO_SEND, `Send: blob: ${item.type}, ${item.size}`);
        } else {
          onEvent(MSG_SEND_EMPTY, `Send: blob: ${item.type}, EMPTY`);
        }
        //If item is like string or sth
      } else {
        socket.current?.emit("send_message_to_room", {
          room_id: roomNo,
          message: item,
        });
        onEvent(MSG_SEND, `Send tag: ${item}`);
      }
    } else {
      onError(ERR_CLIENT, `No web socket connection: failed to send: ${item}`);
    }
  }

  // recording stop
  function stopRecord() {
    // Stop the regular sending of audio
    clearInterval(intervalKey);
    setIntervalKey(null);
    // Stop recording
    if (mediaRecorder) {
      try {
        mediaRecorder.current?.stop();
        console.log("mediaRecorder stop");
      } catch {
        console.log("mediaRecorder stop error");
      }
      try {
        subRecorder.current?.stop();
        subRecorder.current?.clear();
        console.log("subRecorder stop");
      } catch {
        console.log("subRecorder stop error");
      }
      onEvent(MSG_STOP, "Stopped recording");

      // Push the remaining audio to the server
      subRecorder.current?.exportWAV((blob: Blob) => {
        // socket send audio
        socketSend(blob);
        // socket send recording finish sign
        socketSend("finish_audio");
        subRecorder.current?.clear();
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
      if (socket) {
        socket.current?.emit("close_room", { room_id: roomNo });
        socket.current?.close();
        // setSocket(null);
        socket.current = null;
      }
      setIsRecording(false);
      closeRoomAPI();
    } else {
      onError(ERR_AUDIO, "Recorder undefined");
    }
  }

  function cancel() {
    // Stop the regular sending of audio (if present)
    clearInterval(intervalKey);
    if (subRecorder) {
      subRecorder.current?.stop();
      subRecorder.current?.clear();
      onEvent(MSG_STOP, "Stopped recording");
    }
    if (socket) {
      socket.current?.emit("close_room", { room_id: roomNo });
      socket.current?.close();
      // setSocket(null);
      socket.current = null;
    }
    setIsRecording(false);
    closeRoomAPI();
  }

  //room close http api request
  async function closeRoomAPI() {
    MeetingAPI.finishMeeting(accessToken!, roomSeq!)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log("room close error", err);
      });
  }

  return (
    <div className="m-10 flex flex-col ">
      <div className="m-auto ">
        <button
          className="mt-12 h-20 w-52 border border-red-main"
          onClick={startRecord}
        >
          시작
        </button>
        {audio && <audio src={audio} controls />}
      </div>
    </div>
  );
}
