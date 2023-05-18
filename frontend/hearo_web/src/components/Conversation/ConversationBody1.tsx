import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, FloatingButton, MemoComp } from "@/components";
import AddFavModal from "./MeetingBody/AddFavModal";
import GPTRecommend from "./GPTRecommend";
import ExitModal from "./ExitModal";
import { Recorder } from "@/STT/recorder";
import { TTS, STT } from "@/apis";
import { MeetingAPI } from "@/apis/api";
import { Socket, io } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";
import { decodeUnicode } from "@/STT/Transcription";
import Alert from "../common/ui/Alert";
import { MemoType } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { saveMeeting, startMeeting } from "@/redux/modules/meeting";

//FIXME: accessToken 연결 전 수정해야함
const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ0ZWFtc2lrc2lrMkBnbWFpbC5jb20iLCJpYXQiOjE2ODQyODYyNjgsImV4cCI6MTY4NDQxNTg2OH0.xWqpMvBW9aLdyN60iUjXbfp64ozjsbP3B_uMivQ4Uf0";
const roomNo = 1343;

const socketURl = "http://k8a6031.p.ssafy.io:80/";
const recorderWorkerPath = "../STT/recorderWorker.js";

/**
 * socket.io 연결
 * 마이크 연결
 * 스피커로 TTS 출력
 * 대화 녹음
 * @returns (화자 분리되어) 대화 내역 출력
 */

interface MessageType {
  id: number;
  content: string;
  speaker: string;
}

interface PropsType {
  message?: string;
  isStarted: boolean;
  setIsStarted: React.Dispatch<SetStateAction<boolean>>;
  togglePlay: () => void;
  setTimerStarted: React.Dispatch<React.SetStateAction<boolean>>;
  seconds: number;
}

function ConversationBody1({
  message,
  isStarted,
  setIsStarted,
  togglePlay,
  setTimerStarted,
  seconds,
}: PropsType) {
  // person Id
  const [id, setId] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  // regarding component status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSTTLoading, setIsSTTLoading] = useState<boolean>(false);

  const [openMemoPage, setOpenMemoPage] = useState<boolean>(false);
  const [openExitModal, setOpenExitModal] = useState<boolean>(false);
  const [openAlertModal, setOpenAlertModal] = useState<boolean>(false);
  // get GPT 추천 modal
  const [openGPTModal, setOpenGPTModal] = useState<boolean>(false);
  // 자주 쓰는 말 modal
  const [openAddFavModal, setOpenAddFavModal] = useState<boolean>(false);
  // 전체 대화 텍스트
  const [conversation, setConversation] = useState<MessageType[]>([]);
  const [partialResult, setPartialResult] = useState<string>("");

  // Text-to-Speech를 위한 text
  const [text, setText] = useState<string>("");

  const addMemoList = useAppSelector((state) => state.meeting.memoList);
  const [memoList, setMemoList] = useState<MemoType[]>([]);

  const [intervalKey, setIntervalKey] = useState<any>();
  const [mediaStream, setMediaStream] = useState<MediaStream>(); //streaming되는 미디어
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioArray, setAudioArray] = useState<Blob[]>([]);

  const mediaRecorder = useRef<MediaRecorder>();
  const subRecorder = useRef<Recorder>();

  const [audio, setAudio] = useState<string>(); //whole audio blob url
  // meeting room no
  const roomSequence = useRef<number>(0);
  const roomSeq = useAppSelector((state) => state.meeting.roomInfo.roomSeq);
  const webSocket = useRef<WebSocket | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    roomSequence.current = roomSeq;
  }, [roomSeq]);

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
      setId((prev) => prev + 1);
      setConversation((prevConversation) => [
        ...prevConversation,
        { id: id, content: message, speaker: "user" },
      ]);
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

  function handleGPTClick() {
    //TODO: 상대방 말 클릭 -> gpt 추천 -> 추천 리스트
    setOpenGPTModal(!openGPTModal);
  }

  function createSocket() {
    console.log("try to connect webSocket");
    const websocket = new WebSocket("http://k8a6031.p.ssafy.io:80/");

    if (!websocket) {
      throw new Error("socket error!");
    }

    websocket.onopen = function () {
      console.log("websocket connected");
      webSocket.current = websocket;
      //   socketSend("msg");
      var reader = new FileReader();
      const intervalKey = setInterval(() => {
        subRecorder.current?.exportWAV((blob: Blob) => {
          //base64 encoding
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            var base64String = reader.result;
            socketSend(base64String);
          };
          subRecorder.current?.clear();
        }, "audio/wav");
        // subRecorder.current?.exportBase64((data: string) => {
        //   socketSend(data);
        //   //   console.log(blob);
        //   subRecorder.current?.clear();
        // }, "base64");
      }, 100);
      setIntervalKey(intervalKey);

      try {
        subRecorder.current?.record();
        console.log("ready for speech");
      } catch (err) {
        console.log("subRecorder doesn't work");
      }
    };

    websocket.onmessage = function (message) {
      console.log("message form sokcet", message);
      //   const msg = JSON.parse(message.data);
      //   if (msg.cmd === "result") {
      //     console.log(msg.data);
      //   }
      //   if (msg.cmd === "test") {
      //     console.log(msg.data);
      //   }
      //   if (msg.cmd === "stt") {
      //     onPartialResults(msg.data);
      //     conversation.push(msg.data);
      //   }
    };

    websocket.onclose = function (e) {
      console.log("web socket closed");
    };

    websocket.onerror = function (e) {};

    return webSocket;
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
    if (result !== "." && !result.includes("^"))
      setPartialResult((prev) => result);
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
    audioContext.resume().then(() => {});

    return mediaRecorder;
  }

  // recording start
  function startRecord() {
    if (mediaRecorder.current) {
      console.log(mediaRecorder.current);
      return;
    }
    if (webSocket.current) {
      console.log(webSocket.current);
      cancel();
      return;
    }

    if (!isRecording) {
      const start = async () => {
        try {
          const result = await dispatch(startMeeting(accessToken!));
          if (result) {
            record()
              .then((response) => {
                createSocket();
              })
              .catch((error) => {});
          } else {
          }
        } catch (err) {}
      };
      start();
    }
  }

  function socketSend(item: any) {
    if (webSocket) {
      // If item is an audio blob
      webSocket.current?.send(item);
      //   if (item instanceof Blob) {
      //     if (item.size > 0) {
      //       webSocket.current?.send(item);
      //       onEvent(AUDIO_SEND, `Send: blob: ${item.type}, ${item.size}`);
      //     } else {
      //       onEvent(MSG_SEND_EMPTY, `Send: blob: ${item.type}, EMPTY`);
      //     }
      //     //If item is like string or sth
      //   } else {
      //     webSocket.current?.send("send_message_to_room");
      //     onEvent(MSG_SEND, `Send tag: ${item}`);
      //   }
    } else {
      console.log("d");
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

      //   subRecorder.current?.exportWAV((blob: Blob) => {
      //     // socket send audio
      //     socketSend(blob);
      //     // socket send recording finish sign
      //     // socketSend("finish_audio");
      //     subRecorder.current?.clear();
      //   }, "audio/wav");

      subRecorder.current?.exportBase64((blob: Blob) => {
        // socket send audio
        socketSend(blob);
        // socket send recording finish sign
        // socketSend("finish_audio");
        subRecorder.current?.clear();
      }, "base64");
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
      if (webSocket) {
        webSocket.current?.send("close_room");
        webSocket.current?.close();
        webSocket.current = null;
      }
      setIsRecording(false);
      setTimerStarted(false);
      setIsLoading(false);
    } else {
    }
  }

  function cancel() {
    // Stop the regular sending of audio (if present)
    clearInterval(intervalKey);
    if (subRecorder) {
      subRecorder.current?.stop();
      subRecorder.current?.clear();
    }
    if (webSocket) {
      webSocket.current?.send("close_room");
      webSocket.current?.close();
      // setSocket(null);
      webSocket.current = null;
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
    return () => {};
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
            {conversation ? (
              <motion.div
                key="left"
                style={{
                  maxHeight: "600px",
                  width: openMemoPage ? "70%" : "100%",
                  transition: "width 0.5s",
                  overflow: "auto",
                }}
              >
                {text && <TTS text={text} setText={setText} />}
                {conversation.map((item, idx) => {
                  return (
                    <>
                      {item.speaker === "user" ? (
                        <Dialog
                          setOpenAddFavModal={setOpenAddFavModal}
                          onClick={handleDialogClick}
                          key={item.id}
                          type={"user_text"}
                        >
                          {item.content}
                        </Dialog>
                      ) : (
                        <Dialog
                          onClick={handleGPTClick}
                          key={item.id}
                          type={
                            item.speaker === "other1"
                              ? "other1_text"
                              : item.speaker === "other2"
                              ? "other2_text"
                              : item.speaker === "other3"
                              ? "other3_text"
                              : item.speaker === "other4"
                              ? "other4_text"
                              : ""
                          }
                        >
                          {item.content}
                        </Dialog>
                      )}
                    </>
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
        {openGPTModal && <GPTRecommend setOpenGPTModal={setOpenGPTModal} />}
        {openAddFavModal && (
          <AddFavModal setOpenAddFavModal={setOpenAddFavModal} />
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

export default ConversationBody1;
