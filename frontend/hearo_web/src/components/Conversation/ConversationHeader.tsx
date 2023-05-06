import React, { useEffect, useState } from "react";
import { Timer, Button } from "@/components";
import { ReactComponent as Info } from "../../assets/Info-rect.svg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
  function handleClick() {
    // information
    setOpenModal(!openModal);
  }
  function handleExitClick() {
    //TODO: 대화 나가기 -> 저장하고 나가시겠어요?
    setOpenExitModal(!openExitModal);
  }

  return (
    <section className="flex h-12 items-center justify-between bg-white px-4 text-center">
      <motion.button whileHover={{ scale: 1.1 }} onClick={handleClick}>
        <Info />
      </motion.button>
      <div className="w-full">
        <Timer />
      </div>
    </section>
  );
}

export default ConversationHeader;
