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

function RecordPage() {
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
      <div className="fixed right-0 w-[82%]">
        <div>
          우선 폴더들이 들어가야하고,  
          내용들이 들어가야해
        </div>
      </div>
    </div>
  );
}
export default RecordPage;
