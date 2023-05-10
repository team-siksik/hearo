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
import STT from "@/apis/STT";

// TODO: 좌측 기능, 우측 버튼, 챗봇버튼(?)

function ConversationPage() {
  // open modal
  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);
  const [openExitModal, setOpenExitModal] = useState<boolean>(false);

  // recording
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // tts
  const [newMessage, setNewMessage] = useState<string>("");

  const stopRecording = () => {
    // if (dictate !== undefined) dictate.stopListening();
    setIsRecording(false);
  };

  // useEffect(() => {
  //   return () => {
  //     stopRecording();
  //   };
  // }, [dictate]);

  function finishMeeting() {
    stopRecording();
    setOpenExitModal(true);
  }

  useEffect(() => {
    setIsRecording(true); // 시작하자마자 recording 시작함
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
      <MeetingSidebar />
      <div className="absolute mt-20 right-0 w-[82%]">
        <ConversationHeader
          openModal={openInfoModal}
          setOpenModal={setOpenInfoModal}
          openExitModal={openExitModal}
          setOpenExitModal={setOpenExitModal}
        />
        <ConversationBody
          message={newMessage}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
        <STT />
        <FloatingButton onClick={finishMeeting} />
        <ConversationFooter setNewMessage={setNewMessage} />
      </div>
    </div>
  );
}

export default ConversationPage;
