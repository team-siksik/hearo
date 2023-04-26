import React, { useEffect, useRef, useState } from "react";
import CommunicationStart from "../components/Communication/CommunicationStart";
import CommunicationComp from "../components/Communication/CommunicationComp";
import startVoice from "../assets/start.wav";

/**
 *
 * 대화 화면
 * @returns
 */
function CommunicationPage() {
  // const [comp, setComp] = useState<string>("null");
  const [comp, setComp] = useState<string>("start_comm");
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setComp("voice_play");
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    function handleAudioEnded() {
      setIsPlaying(false);
      setTimeout(() => {
        setComp("comm");
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
      <audio ref={audioRef} src={startVoice} />

      {comp === "start_comm" ? (
        <div className="bg-white ">
          <button
            onClick={togglePlay}
            className="rounded-full border-cyan-600 w-60 m-5 border shadow-md"
          >
            대화 시작하기
          </button>
        </div>
      ) : comp === "voice_play" ? (
        <CommunicationStart setComp={setComp} />
      ) : comp === "comm" ? (
        <CommunicationComp />
      ) : null}
    </div>
  );
}

export default CommunicationPage;
