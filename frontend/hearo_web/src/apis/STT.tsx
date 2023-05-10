import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { MeetingAPI } from "./api";
import { Recorder } from "@/STT/recorder";
import { Socket, io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

interface PropsType {}

interface AudioSourceConstraints {
  audio?: any;
}

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

const server = "http://ubuntu@k8a6031.p.ssafy.io:80";
const serverStatus = "";
const recorderWorkerPath = "@/SST/recorder.ts";
const user_id = localStorage.getItem("user");
const roomSeq = 0;
const CONTENT_TYPE =
  "content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1";
const INTERVAL = 250;

export default function STT({}: PropsType) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<any>();
  const [audioSourceId, setAudioSourceId] = useState<any>();
  const [recorder, setRecorder] = useState<any>();
  const [downloader, setDownloader] = useState<any>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [intervalKey, setIntervalKey] = useState<NodeJS.Timeout | null>();
  const [socketServerStatus, setSocketServerStatus] = useState<any>();
  const [partialResult, setPartialResult] = useState<string>("");

  // about audio play
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);
  const [audio, setAudio] = useState<Blob>();
  const [audioSrc, setAudioSrc] = useState("");
  const [playing, setPlaying] = useState<boolean>(false);
  const [currLength, setCurrLength] = useState<number>(0);
  const [audioLength, setAudioLength] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const navigate = useNavigate();

  function onEvent(code: any, data: any) {
    console.log(`msg: ${code} : ${data || ""}\n`);
  }
  function onError(code: any, data: any) {
    console.log(`Error: ${code} : ${data}\n`);
    cancel();
  }

  function init(type: number) {
    return new Promise((resolve, reject) => {
      onEvent(
        MSG_WAITING_MICROPHONE,
        "Waiting for approval to access your microphone ..."
      );
      try {
        setAudioContext(new AudioContext({ sampleRate: 16000 }));
        // 마이크 사운드 get
        if (navigator.mediaDevices.getUserMedia !== undefined) {
          const audioSourceConstraints: AudioSourceConstraints = {};
          if (audioSourceId) {
            audioSourceConstraints.audio = {
              optional: [{ sourceId: audioSourceId }],
            };
          } else {
            audioSourceConstraints.audio = true;
          }
          navigator.mediaDevices
            .getUserMedia(audioSourceConstraints)
            .then((stream) => {
              setStream(stream);
              /* use the stream */
              const input: MediaStreamAudioSourceNode =
                audioContext.createMediaStreamSource(stream);
              onEvent(MSG_MEDIA_STREAM_CREATED, "Media stream created");
              const recorder = new Recorder(input, {
                workerPath: recorderWorkerPath,
              });
              console.log(recorder);
              setRecorder(
                new Recorder(input, {
                  workerPath: recorderWorkerPath,
                })
              );
              onEvent(MSG_INIT_RECORDER, "Recorder initialized");
              resolve(true);
            });
        } else {
          onError(ERR_CLIENT, "No user media support");
          resolve(false);
        }
      } catch (e: any) {
        throw new Error(`Error initializing Web Audio browser: ${e}`);
      }
    });
  }

  //recording이 끝나면?
  function onEndRecording(blob: Blob) {
    try {
      setAudio(blob);
      const audioData = new FormData();
      audioData.append("audio", blob);
      console.log(blob.size);
      MeetingAPI.finishMeeting(
        localStorage.getItem("accessToken")!,
        roomSeq,
        audioData
      ).then((response) => {
        console.log(response);
        //TODO: 회의를 성공적으로 기록하였습니다.
        alert("회의를 성공적으로 기록하였습니다. ");
        navigate("/records");
      });
    } catch {
      alert("강의 음성을 저장하지 못했습니다.");
    }
  }

  function stopRecording() {
    stopListening();
    setIsRecording(false);
  }

  function startListening() {
    if (!recorder) {
      onError(ERR_AUDIO, "Recorder undefined");
      return;
    }
    if (socket) {
      cancel();
    }
    try {
      //recorder 생성
      const options = {
        audioBitsPerSecond: 16000,
        mimeType: "audio/webm;codecs=opus",
      };
      // 녹음된 음성을 서버로 보내기 위한 downloader 생성
      setDownloader(new MediaRecorder(stream!, options));
      let chunks: Blob[] = [];
      downloader.ondataavailable = (e: BlobEvent) => {
        chunks.push(e.data);
      };

      downloader.onstop = (e: BlobEvent) => {
        const blob = new Blob(chunks, { type: chunks[0].type });
        onEndRecording(blob);
        const url = URL.createObjectURL(blob);
        setAudioSrc(url);
      };
      downloader.start();
      setSocket(createSocket());
      audioContext.resume().then(() => {
        onEvent(MSG_AUDIOCONTEXT_RESUMED, "Audio context resumed");
      });
    } catch (err: any) {
      onError(ERR_CLIENT, "No web socket support in this browser!");
    }
  }

  function stopListening() {
    // Stop the regular sending of audio
    setIntervalKey(null);
    // Stop recording
    if (recorder) {
      try {
        downloader.stop();
      } catch {
        console.log("downloader error");
      }
      recorder.stop();
      onEvent(MSG_STOP, "Stopped recording");
      // Push the remaining audio to the server
      recorder.export16kMono((blob: Blob) => {
        socketSend(blob);
        // socketSend(TAG_END_OF_SENTENCE);
        recorder.clear();
      }, "audio/x-raw");
      console.log("end of speech");
      // custom : stopListening 시에 녹음 완전히 취소
      if (stream !== undefined) {
        const tracks = stream!.getTracks();
        if (tracks !== undefined) {
          tracks.forEach((track) => {
            track.stop();
          });
        }
      }
    } else {
      onError(ERR_AUDIO, "Recorder undefined");
    }
  }

  function decodeUnicode(unicodeString: string): string {
    const r = /\\u([\d\w]{4})/gi;
    unicodeString = unicodeString.replace(r, function (match, grp) {
      return String.fromCharCode(parseInt(grp, 16));
    });
    return unescape(unicodeString);
  }

  function onPartialResults(hypos: any) {
    const result = decodeUnicode(hypos[0].transcript)
      .replace(/<UNK>/gi, "")
      .replace(/{/gi, "")
      .replace(/}/gi, "")
      .replace(/\[/gi, "")
      .replace(/\]/gi, "")
      .replace(/\(/gi, "")
      .replace(/\)/gi, "");
    if (result !== "." && !result.includes("^"))
      setPartialResult((prev) => result);
  }
  function onResults(hypos: any, start: number, end: number) {
    setPartialResult((prev) => "");
    const result = decodeUnicode(hypos[0].transcript)
      .replace(/<UNK>/gi, "")
      .replace(/{/gi, "")
      .replace(/}/gi, "")
      .replace(/\[/gi, "")
      .replace(/\]/gi, "")
      .replace(/\(/gi, "")
      .replace(/\)/gi, "");
    console.log(`result : ${result}, start: ${start}, end: ${end}`);
    if (result.includes("^")) {
      const startTime = Math.floor(start);
    } else if (result !== "" && result !== ".") {
      const endTime = Math.floor(end);
    }
  }

  function cancel() {
    // Stop the regular sending of audio (if present)
    setIntervalKey(null);

    if (recorder) {
      recorder.stop();
      recorder.clear();
      onEvent(MSG_STOP, "Stopped recording");
    }
    if (socket) {
      socket.close();
      setSocket(null);
    }
  }
  const socketSend = (item: any) => {
    if (socket && socket.connected) {
      socket.on("connect", () => {
        if (item instanceof Blob) {
          if (item.size > 0) {
            socket.send(item);
            onEvent(MSG_SEND, `Send: blob: ${item.type}, ${item.size}`);
          } else {
            onEvent(MSG_SEND_EMPTY, `Send: blob: ${item.type}, EMPTY`);
          }
          // Otherwise it's the EOS tag (string)
        } else {
          socket.send(item);
          onEvent(MSG_SEND_EOS, `Send tag: ${item}`);
        }
      });
    } else {
      onError(ERR_CLIENT, `No web socket connection: failed to send: ${item}`);
    }
  };

  const createSocket = () => {
    // let url = `${server}?${CONTENT_TYPE}`;
    // if (user_id) {
    //   url += `&user-id=${user_id}`;
    // }
    //TODO: url 확인
    const url = `${server}`;
    const socket = io(url, {
      reconnectionDelayMax: 10000,
      autoConnect: false,
      transports: ["websocket"],
      path: "/ws/socket.io",
    });
    socket.on("data", (args) => {
      const data = args; // socket으로부터 전달 받은 데이터
      onEvent(MSG_WEB_SOCKET, data);
      if (data instanceof Object && !(data instanceof Blob)) {
        onError(ERR_SERVER, "Socket: onEvent: got Object that is not a Blob");
      } else if (data instanceof Blob) {
        onError(ERR_SERVER, "Socket: got Blob");
      } else {
        const res = JSON.parse(data);
        if (res.status === 0) {
          if (res.result) {
            if (res.result.final) {
              onResults(
                res.result.hypotheses,
                res["segment-start"],
                res["total-length"]
              );
            } else {
              onPartialResults(res.result.hypotheses);
            }
          }
        } else {
          onError(ERR_SERVER, `Server error: ${res.status}:${res.status}`);
        }
      }
    });

    socket.on("open", (e: any) => {
      setIntervalKey(
        setInterval(() => {
          recorder.export16kMono((blob: Blob) => {
            socketSend(blob);
            recorder.clear();
          }, "audio/x-raw");
        }, INTERVAL)
      );
      // Start recording
      recorder.record();
      console.log("READY FOR SPEECH\n");
      onEvent(MSG_WEB_SOCKET_OPEN, e);
    });

    // // This can happen if the blob was too big
    // // E.g. "Frame size of 65580 bytes exceeds maximum accepted frame size"
    // // Status codes
    // // http://tools.ietf.org/html/rfc6455#section-7.4.1
    // // 1005:
    // // 1006:

    socket.on("close", (e: any) => {
      const { code, reason, wasClean } = e;
      // The server closes the connection (only?)
      // when its endpointer triggers.
      console.log("web socket closed");
      alert("소켓(이)가 종료되었습니다.");
      onEvent(MSG_WEB_SOCKET_CLOSE, `${code}/${reason}/${wasClean}`);
    });

    socket.on("connect_error", (e: any) => {
      const { data } = e;
      onError(ERR_NETWORK, data);
    });

    return socket;
  };

  let index = 0;
  const list: any[] = [];

  function transcriptionAdd(text: string, isFinal: boolean) {
    list[index] = text;
    if (isFinal) {
      index += 1;
    }
  }

  function transcriptionAToString() {
    list.join(". ");
  }

  const onClickPlay = () => {
    if (player !== null) {
      player.play();
      setPlaying(true);
      setTimer(
        setInterval(() => {
          setCurrLength(Math.ceil(player.currentTime));
        }, 200)
      );
    }
  };

  const onClickPause = () => {
    if (player !== null) {
      player.pause();
      if (timer) clearInterval(timer);
      setPlaying(false);
    }
  };

  // useEffect(() => {
  //   init(0);
  // }, []);

  function startRecording() {
    // MeetingAPI.startMeeting(localStorage.getItem("accessToken")!)
    //   .then(() => {
    init(0).then((result) => {
      if (result) {
        // setSequence((prev) => prev + 1);
        startListening();
        setIsRecording(true);
        // setWaiting(true);
      }
    });
    // })
    // .catch((e) => {
    //   console.log(e);
    // });
  }

  useEffect(() => {
    return () => {
      if (player !== null) player.pause();
    };
  }, [player]);

  const handlePlay = () => {
    if (audio) {
      const url = URL.createObjectURL(audio);
      setAudioSrc(url);
      console.log(audioSrc);
    }
  };

  return (
    // 녹음!!
    <div>
      <button
        className="border-spacing-1 border border-blue-main"
        // onClick={startRecording}
        onClick={startRecording}
      >
        start record
      </button>
      <button
        className="border-spacing-1 border border-blue-main"
        onClick={stopRecording}
      >
        finish record
      </button>
      <button
        className="border-spacing-1 border border-blue-main"
        onClick={handlePlay}
      >
        Play Audio
      </button>
      {audioSrc && <audio src={audioSrc} controls />}
    </div>
  );
}
