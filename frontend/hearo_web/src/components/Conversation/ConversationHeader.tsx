import React, { useEffect, useState } from "react";
import { Timer, Button } from "@/components";
import { ReactComponent as Info } from "../../assets/Info-rect.svg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface PropsType {
  timerStarted: boolean;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}
function ConversationHeader({
  timerStarted,
  openModal,
  setOpenModal,
}: PropsType) {
  function handleClick() {
    // information
    setOpenModal(!openModal);
  }

  return (
    <section className="flex h-12 items-center justify-between bg-white px-4 text-center">
      <motion.button whileHover={{ scale: 1.1 }} onClick={handleClick}>
        <Info />
      </motion.button>
      <div className="w-full">
        <Timer timerStarted={timerStarted} />
      </div>
    </section>
  );
}

export default ConversationHeader;
