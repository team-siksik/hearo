import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/common/Navbar/Navbar";
import Carousel from "@/components/common/Carousel/Carousel";
import { SelectedPage } from "@/types/types";
import startVoice from "../assets/start.wav";
import { ReactComponent as StartConver } from "../assets/StartConver.svg";
import { ReactComponent as JoinConver } from "../assets/JoinConver.svg";
import { ReactComponent as CheckConver } from "../assets/CheckConver.svg";
import { ConversationInfo } from "@/components";

function MainPage() {
  const [comp, setComp] = useState<string>("main");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  // 음성 재생
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
        // setComp("comm");
        navigate("/comm");
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

  const commClick = () => {
    navigate("/comm");
  };

  const recordsClick = () => {
    navigate("/records");
  };

  return (
    <div>
    <audio ref={audioRef} src={startVoice} />
    {comp === "main" ? (
      <>
        <Navbar/>
          <div className="pt-14 z-10">
            <div className="pl-[8%] pt-2 text-2xl font-bold">
              안녕하세요, 김갓팀장님!!!
            </div>
            <div className="pl-[8%] pt-1 text-sm font-medium">
              히어로에 오신 것을 환영해요 ^____^
            </div>
            <div className="ml-8 mr-8 pt-2">
              <Carousel />
            </div>

            {/* 대화 시작하기 버튼 */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={togglePlay}
                // onClick={commClick}
                className="m-5 h-24 w-80 rounded-2xl border border-red-sub bg-red-sub text-white shadow-md"
              >
                <div className="flex h-full items-center justify-center">
                  <StartConver />
                  <div className="text-left">
                    <h5 className="mb-2 text-base font-bold">대화 시작하기</h5>
                    <p className="text-xs">상대방과의 대화를 시작해요.</p>
                  </div>
                </div>
              </button>
            </div>
            <div className="flex flex-row items-center justify-center pt-2">
              <button
                onClick={commClick}
                className="m-3 h-48 w-40 rounded-2xl border border-yellow-sub bg-yellow-sub text-white shadow-md"
              >
                <div className="flex h-full w-full flex-col items-center">
                  <div className="text-center">
                    <h5 className="mb-2 mt-4 text-base font-bold">
                      대화 참여하기
                    </h5>
                  </div>
                  <JoinConver />
                </div>
              </button>
              <button
                onClick={recordsClick}
                className="m-3 h-48 w-40 rounded-2xl border border-green-sub bg-green-sub text-white shadow-md"
              >
                <div className="flex h-full w-full flex-col items-center">
                  <div className="text-center">
                    <h5 className="mb-2 mt-4 text-base font-bold">
                      기록 확인하기
                    </h5>
                  </div>
                  <CheckConver />
                </div>
              </button>
            </div>
          </div>
        </>
      ) : comp === "voice_play" ? (
        <ConversationInfo cannotExit={true} 
        />
      ) : null}
    </div>
  );
}

export default MainPage;
