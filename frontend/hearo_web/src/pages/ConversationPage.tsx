import React, { useEffect, useRef, useState } from "react";
import {
  ConversationHeader,
  ConversationBody,
  ConversationFooter,
  ConversationInfo,
  RecordpageSideBar,
} from "@/components";
import startVoice from "@/assets/Sounds/start.wav";
import { useNavigate } from "react-router-dom";
import ConversationBody1 from "@/components/Conversation/ConversationBody1";
import { useAppDispatch } from "@/redux/hooks";
import { getUserSetting } from "@/redux/modules/profile";

function ConversationPage() {
  const [seconds, setSeconds] = useState<number>(0);

  // info audio
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  // open modal
  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);

  // started
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  // tts
  const [newMessage, setNewMessage] = useState<string>("");

  // 음성재생 함수
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setIsPlaying(true);
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    function handleAudioEnded() {
      setIsPlaying(false);
      setTimeout(() => {
        // recording 시작
        setIsStarted(true);
      }, 1000);
    }

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleAudioEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnded);
      }
    };
  }, []);

  return (
    <div>
      {openInfoModal ? (
        <ConversationInfo
          cannotExit={false}
          setOpenInfoModal={setOpenInfoModal}
        />
      ) : null}
      {/* <MeetingSidebar /> */}
      <RecordpageSideBar />
      <audio ref={audioRef} src={startVoice} />
      <div className="absolute right-0 mt-[4.25rem] w-[82%]">
        <ConversationHeader
          timerStarted={timerStarted}
          openModal={openInfoModal}
          setOpenModal={setOpenInfoModal}
          setSeconds={setSeconds}
          seconds={seconds}
        />
        <ConversationBody
          setTimerStarted={setTimerStarted}
          message={newMessage}
          isStarted={isStarted}
          setIsStarted={setIsStarted}
          togglePlay={togglePlay}
          seconds={seconds}
        />
        <ConversationFooter
          isStarted={isStarted}
          setNewMessage={setNewMessage}
        />
      </div>
      {/* // 음성 재생 -> 회의 시작 페이지로 자동 이동 */}
      {isPlaying && <ConversationInfo cannotExit={true} />}
    </div>
  );
}

export default ConversationPage;
