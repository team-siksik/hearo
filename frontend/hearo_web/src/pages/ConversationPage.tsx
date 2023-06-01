import React, { useEffect, useRef, useState } from "react";
import {
  ConversationHeader,
  ConversationBody,
  ConversationFooter,
  ConversationInfo,
  RecordpageSideBar,
} from "@/components";
import startVoice from "@/assets/Sounds/start.wav";
import { redirect, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUserSetting } from "@/redux/modules/profile";
import { MessageType } from "@/types/types";

function ConversationPage() {
  const [seconds, setSeconds] = useState<number>(0);
  // info audio
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  // open modal
  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);

  const [openGPTModal, setOpenGPTModal] = useState<boolean>(false);
  const [requestString, setRequestString] = useState<string>("");
  // const [gptRecommend, setGptRecommend] = useState<string[]>([]);
  // const [gptRecommendItem, setGptRecommendItem] = useState<string>("");
  // started
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  // tts
  const [newMessage, setNewMessage] = useState<string>("");
  //전체 대화
  const [conversation, setConversation] = useState<MessageType[]>([]);

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
      {/* //TODO: sidebar에서 나가기 버튼 누르면 어느페이지로 나갈지 받아와야 함, cancel함수 불러야함 (closeRoomAPI, socket.close를 위해서 ) */}
      {/* <RecordpageSideBar isStarted={isStarted} /> */}
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
          message={newMessage}
          isStarted={isStarted}
          seconds={seconds}
          conversation={conversation}
          togglePlay={togglePlay}
          setIsStarted={setIsStarted}
          setTimerStarted={setTimerStarted}
          setConversation={setConversation}
          setRequestString={setRequestString}
          setOpenGPTModal={setOpenGPTModal}
        />
        <ConversationFooter
          isStarted={isStarted}
          setNewMessage={setNewMessage}
          conversation={conversation}
          setConversation={setConversation}
          setOpenGPTModal={setOpenGPTModal}
          openGPTModal={openGPTModal}
          requestString={requestString}
        />
      </div>
      {/* // 음성 재생 -> 회의 시작 페이지로 자동 이동 */}
      {isPlaying && <ConversationInfo cannotExit={true} />}
    </div>
  );
}

export default ConversationPage;
