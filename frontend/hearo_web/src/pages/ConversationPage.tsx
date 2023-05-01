import React, { useEffect, useState } from "react";
import {
  ConversationHeader,
  ConversationBody,
  ConversationFooter,
  ConversationInfo,
  ExitModal,
} from "@/components";

function ConversationPage() {
  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);
  const [openExitModal, setOpenExitModal] = useState<boolean>(false);

  const [newMessage, setNewMessage] = useState<string>("");

  return (
    <div>
      {openInfoModal ? <ConversationInfo cannotExit={false} /> : null}
      {openExitModal ? <ExitModal setOpenExitModal={setOpenExitModal} /> : null}
      <ConversationHeader
        openModal={openInfoModal}
        setOpenModal={setOpenInfoModal}
        openExitModal={openExitModal}
        setOpenExitModal={setOpenExitModal}
      />
      <ConversationBody message={newMessage} />
      <ConversationFooter setNewMessage={setNewMessage} />
    </div>
  );
}

export default ConversationPage;
