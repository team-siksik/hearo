import React, { useEffect, useState } from "react";
import {
  ConversationHeader,
  ConversationBody,
  ConversationFooter,
  ConversationInfo,
  ExitModal,
} from "@/components";
import MicrophoneAccess from "@/apis/MicrophoneAccess";

function ConversationPage() {
  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);
  const [openExitModal, setOpenExitModal] = useState<boolean>(false);

  // const [stream, setStream] = useState<MediaStream>(new MediaStream());
  const [newMessage, setNewMessage] = useState<string>("");

  return (
    <div>
      {openInfoModal ? <ConversationInfo cannotExit={false} /> : null}
      {openExitModal ? (
        <ExitModal
          // stream={stream}
          setOpenExitModal={setOpenExitModal}
        />
      ) : null}
      {/* <MicrophoneAccess stream={stream} setStream={setStream} /> */}
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
