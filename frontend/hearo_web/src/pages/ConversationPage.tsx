import React, { useEffect, useRef, useState } from "react";
import startVoice from "../assets/start.wav";
import { ReactComponent as Image1 } from "../assets/start_conver.svg";
import { ConversationInfo, ConversationComp } from "@/components";

// TODO: audio 파일이 mainpage에 있어야 함.
/**
 *
 * 대화 화면
 * @returns
 */
function ConversationPage() {
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
        <div className="flex justify-center">
          <button
            onClick={togglePlay}
            className="m-5 h-24 w-80 rounded-2xl border border-red-sub bg-red-sub text-white shadow-md"
          >
            <div className="flex h-full items-center justify-center">
              <Image1 />
              <div className="text-left">
                <h5 className="mb-2 text-base font-bold">대화 시작하기</h5>
                <p className="text-xs">상대방과의 대화를 시작해요.</p>
              </div>
            </div>
          </button>
        </div>
      ) : comp === "voice_play" ? (
        <ConversationInfo cannotExit={true} />
      ) : comp === "comm" ? (
        <ConversationComp />
      ) : null}
    </div>
  );
}

export default ConversationPage;
