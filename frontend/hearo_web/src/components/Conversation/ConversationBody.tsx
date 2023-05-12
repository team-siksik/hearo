import React, { SetStateAction, useEffect, useRef, useState } from "react";
import Dialog from "../common/ui/Dialog";
import GPTRecommend from "./GPTRecommend";
import { TTS, STT } from "@/apis";
import FloatingButton from "../common/ui/FloatingButton";
import FavContents from "./FavContents";
import AddFavModal from "./MeetingBody/AddFavModal";
import Button from "../common/ui/Button";
import STTTest from "@/pages/STTTest";

/**
 * socket.io 연결
 * 마이크 연결
 * 스피커로 TTS 출력
 * 대화 녹음
 * @returns 화자 분리되어 대화 내역 출력
 */

interface MessageType {
  id: number;
  content: string;
  speaker: string;
}

interface PropsType {
  message?: string;
  isRecording: boolean;
  setIsRecording: React.Dispatch<SetStateAction<boolean>>;
}

function ConversationBody({ message, isRecording, setIsRecording }: PropsType) {
  // speaker Id
  const [id, setId] = useState<number>(0);
  // regarding component status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSTTLoading, setIsSTTLoading] = useState<boolean>(false);
  // get GPT 추천 modal
  const [openGPTModal, setOpenGPTModal] = useState<boolean>(false);
  // 자주 쓰는 말 modal
  const [openAddFavModal, setOpenAddFavModal] = useState<boolean>(false);
  // 전체 대화 텍스트
  const [conversation, setConversation] = useState<MessageType[]>([]);
  // Text-to-Speech를 위한 text
  const [text, setText] = useState<string>("");
  const messageEndRef = useRef<HTMLDivElement>(null); // 채팅창 늘어날 수록 스크롤 맨 밑으로 이동

  // 채팅창 늘어날수록 스크롤 맨 밑으로 이동
  useEffect(() => {
    if (messageEndRef.current)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // user이 텍스트 input에 넣으면 화면에 추가해주고, tts로 읽어주기
  useEffect(() => {
    if (message) {
      setText(message);
      setConversation((prevConversation) => [
        ...prevConversation,
        { id: id, content: message, speaker: "user" },
      ]);
      setId((prev) => prev + 1);
    }
  }, [message]);

  // 시작하자마자 record할 것임
  // useEffect(() => {
  //   setIsRecording(true);
  // }, []);

  // when my dialog clicked -> Text To Speech play
  function handleDialogClick(e: React.MouseEvent<HTMLDivElement>) {
    setText("");
    if (e.currentTarget.textContent) {
      setText(e.currentTarget.textContent);
    }
  }

  function handleGPTClick() {
    //TODO: 상대방 말 클릭 -> gpt 추천 -> 추천 리스트
    setOpenGPTModal(!openGPTModal);
  }
  return (
    <>
      {isLoading ? (
        <div>isLoading</div>
      ) : (
        <section className="message-sec h-100 mb-10 overflow-y-scroll pt-10">
          {/* isRecording 이 true 일 때만 STT rendering */}
          <STTTest />
          {conversation ? (
            <div>
              {text && <TTS text={text} setText={setText} />}
              {conversation?.map((item) => {
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
                            : item.speaker === "other5"
                            ? "other5_text"
                            : item.speaker === "other6"
                            ? "other6_text"
                            : item.speaker === "other7"
                            ? "other7_text"
                            : item.speaker === "other8"
                            ? "other8_text"
                            : item.speaker === "other9"
                            ? "other9_text"
                            : item.speaker === "other10"
                            ? "other10_text"
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
            </div>
          ) : (
            <div></div>
          )}
          {openGPTModal && <GPTRecommend setOpenGPTModal={setOpenGPTModal} />}
          {openAddFavModal && (
            <AddFavModal setOpenAddFavModal={setOpenAddFavModal} />
          )}
        </section>
      )}
    </>
  );
}

export default ConversationBody;
