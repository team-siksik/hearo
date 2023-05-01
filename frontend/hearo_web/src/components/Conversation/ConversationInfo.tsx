import React, { useEffect, useRef, useState } from "react";
import startVoice from "../../assets/start.wav";
import { ReactComponent as Info } from "../../assets/Info-rect.svg";
import Modal from "../common/ui/Modal";

interface PropsType {
  cannotExit: boolean;
}

function ConversationInfo({ cannotExit }: PropsType) {
  return (
    <Modal open={true} cannotExit={cannotExit}>
      <section className="mb-3 flex items-center justify-center">
        <Info />
        <h5 className="ml-2 text-base font-bold">
          히어로, 대화를 시작합니다.{" "}
        </h5>
      </section>
      <p className="text-sm">
        이 대화는 목소리가 텍스트로 전환되며, 전달하는 말은 스피커로 출력됩니다.
        <br />
        시스템 볼륨을 확인해주세요.
      </p>
    </Modal>
  );
}

export default ConversationInfo;
