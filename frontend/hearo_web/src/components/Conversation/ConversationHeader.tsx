import React, { useState } from "react";
import { Timer, Button } from "@/components";
import { ReactComponent as Info } from "../../assets/Info-rect.svg";
import { useNavigate } from "react-router-dom";

interface PropsType {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  openExitModal: boolean;
  setOpenExitModal: React.Dispatch<React.SetStateAction<boolean>>;
}
function ConversationHeader({
  openModal,
  setOpenModal,
  openExitModal,
  setOpenExitModal,
}: PropsType) {
  const navigate = useNavigate();
  function handleClick() {
    // information
    setOpenModal(!openModal);
  }
  function handleExitClick() {
    //TODO: 대화 나가기 -> 저장하고 나가시겠어요?
    setOpenExitModal(!openExitModal);
  }
  return (
    <section className="fixed top-0 flex h-12 w-full items-center justify-between bg-white text-center">
      <Button onClick={handleClick}>
        <Info />
      </Button>
      <Timer />
      <Button type="exitConversation" onClick={handleExitClick} />
    </section>
  );
}

export default ConversationHeader;
