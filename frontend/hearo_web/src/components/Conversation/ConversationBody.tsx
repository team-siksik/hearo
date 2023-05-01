import { Message } from "postcss";
import React, { useEffect, useRef, useState } from "react";
import Dialog from "../common/ui/Dialog";
import GPTRecommend from "./GPTRecommend";

/**
 * socket.io 연결
 * 마이크 연결
 * 스피커로 TTS 출력
 * 대화 녹음
 * @returns 화자 분리되어 대화 내역 출력
 */
const mockdata = {
  1: {
    speaker: "other1",
    content: "회의를 시작하겠습니다.",
  },
  2: {
    speaker: "other2",
    content: "네, 시작하시죠",
  },
  3: {
    speaker: "other3",
    content: "이번 주 실적이 어떻게 되시나요 다들?",
  },
};
interface MessageType {
  id: number;
  content: string;
  speaker: string;
}

interface PropsType {
  message?: string;
}

function ConversationBody({ message }: PropsType) {
  const messageEndRef = useRef<HTMLDivElement>(null); // 채팅창 늘어날 수록 스크롤 맨 밑으로 이동
  const [id, setId] = useState<number>(0);
  const [conversation, setConversation] = useState<MessageType[]>([]); // 전체 대화 텍스트
  const [openGPTModal, setOpenGPTModal] = useState<boolean>(false); // get GPT 추천
  const [openAddFavModal, setOpenAddFavModal] = useState<boolean>(false); // 자주 쓰는 말

  useEffect(() => {
    // 채팅창 늘어날 수록 스크롤 맨 밑으로 이동
    if (messageEndRef.current)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Update the conversation state when the message prop changes
  useEffect(() => {
    if (message) {
      setId((prev) => prev + 1);
      setConversation((prevConversation) => [
        ...prevConversation,
        { id: id + 1, content: message, speaker: "user" },
      ]);
      setId((prev) => prev + 1);
      if (id % 3 === 0) {
        setConversation((prev) => [...prev, { id: id + 2, ...mockdata[2] }]);
      } else if (id % 2 === 0) {
        setConversation((prev) => [...prev, { id: id + 2, ...mockdata[3] }]);
      } else {
        setConversation((prev) => [...prev, { id: id + 2, ...mockdata[1] }]);
      }
    }
    console.log(conversation);
  }, [message]);

  function handleDialogClick(e: React.MouseEvent<HTMLDivElement>) {
    console.log(e.currentTarget.textContent);
    //TODO: 여기에서 TTS 돌려야돼
  }

  function handleGPTClick() {
    //TODO: 상대방 말 클릭 -> gpt 추천 -> 추천 리스트
    setOpenGPTModal(!openGPTModal);
  }
  return (
    <section
      className="message-sec mb-10 overflow-y-scroll pt-10"
      style={{ height: "94vh" }}
    >
      {conversation ? (
        <div>
          {conversation?.map((item) => {
            return (
              <>
                {item.speaker === "user" ? (
                  <Dialog
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
      {openGPTModal ? <GPTRecommend /> : null}
    </section>
  );
}

export default ConversationBody;
