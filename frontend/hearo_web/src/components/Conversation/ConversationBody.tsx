import React from "react";

/**
 * socket.io 연결
 * 마이크 연결
 * 스피커로 TTS 출력
 * 대화 녹음
 * @returns 화자 분리되어 대화 내역 출력
 */
const mockdata = {
  1: {
    name: "참가자1",
    content: "회의를 시작하겠습니다.",
  },
  2: {
    name: "참가자2",
    content: "네, 시작하시죠",
  },
  3: {
    name: "참가자3",
    content: "이번 주 실적이 어떻게 되시나요 다들?",
  },
};
function ConversationBody() {
  return (
    <section className="overflow-y-scroll">
      <h1>대화창</h1>
    </section>
  );
}

export default ConversationBody;
