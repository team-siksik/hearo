import React, { useEffect, useState } from "react";
import Timer from "../common/Timer";
import {
  ConversationHeader,
  ConversationBody,
  ConversationFooter,
  ConversationInfo,
} from "@/components";

function ConversationComp() {
  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");

  return (
    <div>
      {openInfoModal ? <ConversationInfo cannotExit={false} /> : null}
      <ConversationHeader
        openModal={openInfoModal}
        setOpenModal={setOpenInfoModal}
      />
      <ConversationBody message={newMessage} />
      <ConversationFooter setNewMessage={setNewMessage} />
    </div>
  );
}

export default ConversationComp;
