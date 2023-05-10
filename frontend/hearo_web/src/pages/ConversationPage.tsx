import React, { useEffect, useState } from "react";
import {
  ConversationHeader,
  ConversationBody,
  ConversationFooter,
  ConversationInfo,
  ExitModal,
  MeetingSidebar,
  FloatingButton,
} from "@/components";
import MicrophoneAccess from "@/apis/STT";
import STT from "@/apis/STT";

// TODO: 좌측 기능, 우측 버튼, 챗봇버튼(?)

function ConversationPage() {
  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);
  const [openExitModal, setOpenExitModal] = useState<boolean>(false);

  const [newMessage, setNewMessage] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);

  function finishMeeting() {
    setIsRecording(false);
    console.log(isRecording);
  }

  useEffect(() => {
    console.log(isRecording);
    setIsRecording(true);
  }, []);

  return (
    <div>
      {openInfoModal ? (
        <ConversationInfo
          cannotExit={false}
          setOpenInfoModal={setOpenInfoModal}
        />
      ) : null}
      {openExitModal ? (
        <ExitModal
          // stream={stream}
          setOpenExitModal={setOpenExitModal}
        />
      ) : null}
      {/* <STT isRecording={isRecording} setIsRecording={setIsRecording} /> */}
      <MeetingSidebar />
      <div className="absolute mt-20 right-0 w-[82%]">
        <ConversationHeader
          openModal={openInfoModal}
          setOpenModal={setOpenInfoModal}
          openExitModal={openExitModal}
          setOpenExitModal={setOpenExitModal}
        />
        <ConversationBody message={newMessage} />
        <FloatingButton onClick={finishMeeting} />
        <ConversationFooter setNewMessage={setNewMessage} />
      </div>
    </div>
  );
}

export default ConversationPage;
