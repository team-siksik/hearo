import { Message } from "postcss";
import React, { useEffect, useState } from "react";
import Dialog from "../common/ui/Dialog";

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
  const [id, setId] = useState<number>(0);
  const [conversation, setConversation] = useState<MessageType[]>([]);

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
  return (
    <section
      className="message-sec my-10 overflow-y-scroll"
      style={{ height: "94vh" }}
    >
      {conversation ? (
        <div>
          {conversation?.map((item) => {
            return (
              <Dialog
                onClick={handleDialogClick}
                key={item.id}
                type={
                  item.speaker === "user"
                    ? "user_text"
                    : item.speaker === "other1"
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
            );
          })}
        </div>
      ) : (
        <div></div>
      )}
    </section>
  );
}

export default ConversationBody;
