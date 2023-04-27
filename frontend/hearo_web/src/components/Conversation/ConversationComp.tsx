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

  return (
    <div>
      {openInfoModal ? <ConversationInfo cannotExit={false} /> : null}
      <ConversationHeader
        openModal={openInfoModal}
        setOpenModal={setOpenInfoModal}
      />
      <ConversationBody />
      <ConversationFooter />
    </div>
  );
}

export default ConversationComp;
