import React, { useState } from "react";
import { Timer, Button } from "@/components";
import { ReactComponent as Info } from "../../assets/Info-rect.svg";
import { useNavigate } from "react-router-dom";

interface PropsType {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}
function ConversationHeader({ openModal, setOpenModal }: PropsType) {
  const navigate = useNavigate();

  function handleClick() {
    // information
    setOpenModal(!openModal);
  }
  function handleExitClick() {
    //TODO: 대화 나가기 -> 저장하고 나가시겠어요?
    console.log("i want to get out!!!!");
    // navigate("/");
  }
  return (
    <section
      className="flex items-center justify-between text-center"
      style={{ height: "5vh" }}
    >
      <Button onClick={handleClick}>
        <Info />
      </Button>
      <Timer />
      <Button type="exitConversation" onClick={handleExitClick} />
    </section>
  );
}

export default ConversationHeader;
