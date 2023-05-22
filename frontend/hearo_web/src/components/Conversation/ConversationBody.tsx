import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, FloatingButton, MemoComp } from "@/components";
import AddFavModal from "./MeetingBody/AddFavModal";
import GPTRecommend from "./GPTRecommend";
import ExitModal from "./ExitModal";
import { Recorder } from "@/STT/recorder";
import { TTS } from "@/apis";
import { MeetingAPI } from "@/apis/api";
import { Socket, io } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";
import { decodeUnicode } from "@/STT/Transcription";
import Alert from "../common/ui/Alert";
import { MemoType, MessageType } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { saveMeeting, startMeeting } from "@/redux/modules/meeting";
import { getUserSetting } from "@/redux/modules/profile";

// const socketURl = "http://k8a6031.p.ssafy.io:80/";
const socketURl = "https://k8a6031.p.ssafy.io:8090/";
const recorderWorkerPath = "../STT/recorderWorker.js";

// Error codes (mostly following Android error names and codes)
const ERR_SOCKET = 1;
const ERR_NETWORK = 2;
const ERR_AUDIO = 3;
const ERR_SERVER = 4;
const ERR_CLIENT = 5;

/**
 * socket.io 연결
 * 마이크 연결
 * 스피커로 TTS 출력
 * 대화 녹음
 * @returns (화자 분리되어) 대화 내역 출력
 */

interface PropsType {
  message?: string;
  isStarted: boolean;
  seconds: number;
  conversation: MessageType[];
  togglePlay: () => void;
  setIsStarted: React.Dispatch<SetStateAction<boolean>>;
  setTimerStarted: React.Dispatch<SetStateAction<boolean>>;
  setConversation: React.Dispatch<SetStateAction<MessageType[]>>;
  setRequestString: React.Dispatch<SetStateAction<string>>;
  setOpenGPTModal: React.Dispatch<SetStateAction<boolean>>;
}

function ConversationBody({
  message,
  isStarted,
  setIsStarted,
  togglePlay,
  setTimerStarted,
  seconds,
  conversation,
  setConversation,
  setOpenGPTModal,
  setRequestString,
}: PropsType) {
  // person Id

  const accessToken = localStorage.getItem("accessToken");
  const userSeq = localStorage.getItem("userSeq");
  const [id, setId] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  // regarding component status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFinal = useRef<boolean>(false);
  const partialResult = useRef<string>("");

  const [openMemoPage, setOpenMemoPage] = useState<boolean>(false);
  const [openExitModal, setOpenExitModal] = useState<boolean>(false);
  const [openAlertModal, setOpenAlertModal] = useState<boolean>(false);

  const [openAddFavModal, setOpenAddFavModal] = useState<boolean>(false);
  const [chosenFavItem, setChosenFavItem] = useState<string>("");
  // Text-to-Speech를 위한 text
  const [text, setText] = useState<string>("");
  const addMemoList = useAppSelector((state) => state.meeting.memoList);
  const userVoiceSetting = useAppSelector(
    (state) => state.user.user?.setting.voiceSetting
  );
  const [memoList, setMemoList] = useState<MemoType[]>([]);

  const [intervalKey, setIntervalKey] = useState<any>();
  const [mediaStream, setMediaStream] = useState<MediaStream>(); //streaming되는 미디어
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioArray, setAudioArray] = useState<Blob[]>([]);

  // const [audioBlob, setAudioBlob] = useState<Blob>();

  // const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(); // 녹음기
  // const [subRecorder, setSubRecorder] = useState<any>(); // worker recorder
  const mediaRecorder = useRef<MediaRecorder>();
  const subRecorder = useRef<Recorder>();

  const [audio, setAudio] = useState<string>(); //whole audio blob url
  const roomSequence = useRef<number>(0);
  // const roomId = useRef<string>("");
  const roomInfo = useAppSelector((state) => state.meeting.roomInfo);
  const socket = useRef<Socket | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const reader = new FileReader();

  useEffect(() => {
    // roomId.current = roomInfo.roomId;
    roomSequence.current = roomInfo.roomSeq;
  }, [roomInfo]);

  function onEvent(code: any, data: any) {
    console.log(`msg: ${code} : ${data || ""}\n`);
  }
  function onError(code: any, data: any) {
    console.log(`Error: ${code} : ${data}\n`);
  }

  // 채팅창 늘어날수록 스크롤 맨 밑으로 이동
  const messageEndRef = useRef<HTMLDivElement>(null);
  // 채팅창 늘어날수록 스크롤 맨 밑으로 이동
  useEffect(() => {
    if (messageEndRef.current)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // user이 텍스트 input에 넣으면 화면에 추가해주고, tts로 읽어주기
  useEffect(() => {
    if (message) {
      setText(message);
      conversation.push({
        content: message,
        speaker: "user",
      });
      partialResult.current = "";
      socket.current?.emit("audio", {
        room_id: 1343,
        audio: null,
        split: true,
      });
      // setConversation((prevConversation) => [
      //   ...prevConversation,
      //   {
      //     // idx: id,
      //     content: message,
      //     speaker: "user",
      //   },
      // ]);
    }
  }, [message]);

  // when my dialog clicked -> Text To Speech play
  function handleDialogClick(e: React.MouseEvent<HTMLDivElement>) {
    setText("");
    if (e.currentTarget.textContent) {
      setText(e.currentTarget.textContent);
    }
  }

  function handleStartBtn() {
    togglePlay();
  }

  function handleGPTClick(str: string) {
    setOpenGPTModal(true);
    setRequestString(str);
  }

  function createSocket() {
    const socket1 = io("https://k8a6031.p.ssafy.io:8090/", {
      reconnectionDelayMax: 10000,
      autoConnect: true,
      transports: ["websocket"],
      path: "/ws/socket.io",
    });

    if (!socket1) {
      throw new Error("socket error!");
    }
    // start recording if socket is connected
    socket1.on("connect", () => {
      console.log("connected");
      socket.current = socket1;
      socket1.emit("enter_room", {
        room_id: 1434,
      });

      console.log("enter_the_room");
      const intervalKey = setInterval(() => {
        subRecorder.current?.exportWAV((blob: Blob) => {
          socketSend(blob);
          // reader.readAsDataURL(blob);
          // reader.onloadend = function () {
          //   socketSend(reader.result);
          // };
          subRecorder.current?.clear();
        }, "audio/wav");
      }, 250);
      setIntervalKey(intervalKey);
      try {
        subRecorder.current?.record();
        console.log("ready for speech");
      } catch (err) {
        console.log("subRecorder doesn't work");
      }
      // onEvent(MSG_WEB_SOCKET_OPEN, "socket_open");
    });

    socket1.on("data", (e) => {
      const { final, transcript } = e;
      console.log(final, transcript);
      if (transcript !== "nothing" && transcript.trim() !== "") {
        if (partialResult.current === "") {
          // 대화 내역이 없을 때
          partialResult.current = transcript;
          conversation.push({
            content: transcript,
            speaker: "other1",
          });
        } else {
          // 대화 중일 때
          if (final === false) {
            partialResult.current = transcript;
            let lastIdx = -1;
            for (let i = conversation.length - 1; i >= 0; i--) {
              console.log(conversation[i].speaker);
              if (conversation[i].speaker === "other1") {
                lastIdx = i;
                break;
              }
            }
            conversation[lastIdx].content = transcript;
          } else if (final === true) {
            // final이 true가 나오면 partialResult을 초기화하고
            partialResult.current = "";
          }
        }
      }
    });

    // info 라는 이벤트 메시지를 받았을 때
    socket1.on("info", (e) => {
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
        // console.log(data);
      }
    });

    socket1.on("disconnect", (e) => {
      console.log("web socket closed");
    });

    socket1.on("error", (e) => {
      console.log("socket error");
      // onEvent(ERR_SOCKET, e);
    });

    socket1.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    return socket1;
  }

  function onPartialResults(script: any) {
    const result = decodeUnicode(script[0].transcript)
      .replace(/<UNK>/gi, "")
      .replace(/{/gi, "")
      .replace(/}/gi, "")
      .replace(/\[/gi, "")
      .replace(/\]/gi, "")
      .replace(/\(/gi, "")
      .replace(/\)/gi, "");
    if (result !== "." && !result.includes("^")) partialResult.current = result;
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
    setTimerStarted(true);
    setIsStarted(true);
    setIsLoading(true);

    const subRecorder1 = new Recorder(input, {
      workerPath: { recorderWorkerPath },
    });
    // setSubRecorder(subRecorder);
    subRecorder.current = subRecorder1;

    // MediaRecorder 생성 - 전체 녹음하는 recorder
    const mediaRecorder1 = new MediaRecorder(mediaStream, {
      audioBitsPerSecond: 16000,
      // mimeType: "audio/wav; codecs=opus",
    });
    // onEvent(MSG_INIT_RECORDER, "Recorder initialized");
    // setMediaRecorder(mediaRecorder);
    mediaRecorder.current = mediaRecorder1;

    // 이벤트핸들러: 녹음 데이터 취득 처리
    mediaRecorder1.ondataavailable = (event) => {
      audioArray.push(event.data); // 오디오 데이터가 취득될 때마다 배열에 담아둔다.
    };

    // 이벤트핸들러: 녹음 종료 처리 & 재생하기
    mediaRecorder1.onstop = () => {
      // 녹음이 종료되면, 배열에 담긴 오디오 데이터(Blob)들을 합친다: 코덱도 설정해준다.
      const blob = new Blob(audioArray, { type: audioArray[0].type });
      // audioArray.splice(0); // 기존 오디오 데이터들은 모두 비워 초기화한다.
      // Blob 데이터에 접근할 수 있는 주소를 생성한다.

      closeRoomAPI(blob);

      setIsRecording(false);
    };

    // 녹음 시작
    mediaRecorder1.start();
    setIsRecording(true);

    //audioContext.state가 'suspended'이면 재실행함 -> 반대로 'running'일 경우, suspend()함수로 일시정지 시킬 수 있음
    audioContext.resume().then(() => {
      // onEvent(MSG_AUDIOCONTEXT_RESUMED, "Audio context resumed");
    });

    return mediaRecorder;
  }

  // recording start
  function startRecord() {
    // onEvent(
    //   MSG_WAITING_MICROPHONE,
    //   "Waiting for approval to access your microphone ..."
    // );
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
      const start = async () => {
        try {
          const result = await dispatch(startMeeting(accessToken!));
          console.log(result);
          if (result) {
            record()
              .then((response) => {
                createSocket();
              })
              .catch((error) => {
                onError(ERR_AUDIO, "Recorder undefined");
              });
          } else {
            onError(ERR_CLIENT, `start meeting failed`);
          }
        } catch (err) {
          onError(ERR_CLIENT, `No user media support, ${err}`);
        }
      };
      start();
    }
  }

  function socketSend(item: any) {
    if (socket) {
      // If item is an audio blob
      if (item instanceof Blob) {
        if (item.size > 0) {
          socket.current?.emit("audio", {
            room_id: userSeq,
            audio: item,
            split: false,
          });
          // onEvent(AUDIO_SEND, `Send: blob: ${item.type}, ${item.size}`);
        } else {
          // onEvent(MSG_SEND_EMPTY, `Send: blob: ${item.type}, EMPTY`);
        }
        //If item is like string or sth
      } else {
        // socket.current?.emit("send_message_to_room", {
        //   room_id: roomNo,
        //   message: item,
        // });
        socket.current?.emit("waveform", {
          room_id: userSeq,
          audio: item,
        }); // base64

        // onEvent(MSG_SEND, `Send tag: ${item}`);
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

      // Push the remaining audio to the server

      subRecorder.current?.exportWAV((blob: Blob) => {
        // socket send audio
        socketSend(blob);
        // reader.readAsDataURL(blob);
        // reader.onloadend = function () {
        //   var base64String = reader.result;
        //   socketSend(base64String);
        // };
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
        socket.current?.emit("close_room", { room_id: userSeq });
        socket.current?.close();
        socket.current = null;
      }
      setIsRecording(false);
      setTimerStarted(false);
      setIsLoading(false);
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
      // onEvent(MSG_STOP, "Stopped recording");
    }
    if (socket) {
      socket.current?.emit("close_room", { room_id: userSeq });
      socket.current?.close();
      // setSocket(null);
      socket.current = null;
    }
    setIsRecording(false);
    closeRoomAPI();
  }

  //room close http api request
  async function closeRoomAPI(blob?: Blob) {
    MeetingAPI.finishMeeting(accessToken!, roomSequence.current!)
      .then(() => {
        if (blob) {
          dispatch(saveMeeting(blob))
            .then(() => {
              // successfully finished and saved meeting
              navigate("/records");
              console.log("기록이 저장되었습니다. ");
            })
            .catch((err) => {
              console.log("room save error", err);
            });
        }
      })
      .catch((err) => {
        console.log("room close error", err);
      });
  }

  useEffect(() => {
    if (isStarted) {
      startRecord();
    }
  }, [isStarted]);

  return (
    <>
      <section className="message-sec mb-12 h-full overflow-x-auto ">
        {openExitModal && (
          <ExitModal
            setOpenExitModal={setOpenExitModal}
            stopRecord={stopRecord}
          />
        )}

        {!isStarted && !isRecording ? (
          <div className="flex justify-center">
            <Button onClick={handleStartBtn} type="simpleBlueBtn">
              대화 시작
            </Button>
          </div>
        ) : (
          <div className="flex scroll-mx-0 flex-row">
            {conversation.length > 0 ? (
              <motion.div
                key="left"
                style={{
                  maxHeight: "600px",
                  width: openMemoPage ? "70%" : "100%",
                  transition: "width 0.5s",
                  overflow: "auto",
                }}
              >
                {text && (
                  <TTS
                    text={text}
                    setText={setText}
                    userVoiceSetting={userVoiceSetting}
                  />
                )}
                {conversation.map((item, idx) => {
                  return (
                    <div key={idx}>
                      {item.speaker === "user" ? (
                        <Dialog
                          setOpenAddFavModal={setOpenAddFavModal}
                          favContent={item.content}
                          onClick={handleDialogClick}
                          setChosenFavItem={setChosenFavItem}
                          type={"user_text"}
                        >
                          {item.content}
                        </Dialog>
                      ) : (
                        <Dialog
                          onClick={(e) => handleGPTClick(item.content)}
                          type={
                            item.speaker === "other1"
                              ? "1"
                              : item.speaker === "other2"
                              ? "2"
                              : item.speaker === "other3"
                              ? "3"
                              : item.speaker === "other4"
                              ? "4"
                              : ""
                          }
                        >
                          {item.content}
                        </Dialog>
                      )}
                    </div>
                  );
                })}
                <div className="scroll-bottom" ref={messageEndRef}></div>
              </motion.div>
            ) : (
              <div></div>
            )}

            {/* 메모 div */}
            <AnimatePresence>
              {openMemoPage && (
                <motion.div
                  key="right"
                  style={{
                    width: "30%",
                    height: "600px",
                  }}
                  initial={{ width: "0%", height: "600px" }}
                  animate={{ width: "30%", height: "600px" }}
                  exit={{ width: "0%", height: "600px" }}
                  transition={{ duration: 0.5 }}
                >
                  <MemoComp
                    seconds={seconds}
                    openMemoPage={openMemoPage}
                    memoList={memoList}
                    setMemoList={setMemoList}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        {openAddFavModal && (
          <AddFavModal
            setOpenAddFavModal={setOpenAddFavModal}
            chosenFavItem={chosenFavItem}
          />
        )}
        {openAlertModal && (
          <Alert setOpenAlertModal={setOpenAlertModal}>
            대화를 시작하는 버튼을 눌러주세요
          </Alert>
        )}
        <FloatingButton
          type="memo"
          onClick={() => {
            if (isStarted) {
              setOpenMemoPage((prev) => !prev);
            } else {
              setOpenAlertModal(true);
            }
          }}
        />
        <FloatingButton
          type="close"
          onClick={() => {
            setOpenExitModal(true);
          }}
        />
      </section>
    </>
  );
}

export default ConversationBody;
