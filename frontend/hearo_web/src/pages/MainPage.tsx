import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/common/Navbar/Navbar";
import Carousel from "@/components/common/Carousel/Carousel";

import { SelectedPage } from "@/types/types";
import startVoice from "@/assets/Sounds/start.wav";
import { ReactComponent as StartConver } from "../assets/StartConver.svg";
import { ReactComponent as JoinConver } from "../assets/JoinConver.svg";
import { ReactComponent as CheckConver } from "../assets/CheckConver.svg";
import { ConversationInfo } from "@/components";

import { useAppSelector } from "@/redux/hooks";
import type { RootState } from "@/redux/configStore";

// TODO: 캐러셀 위에 로그인 여부에 따라 멘트가 달라져야함
// TODO: 로그인이 필요할 때 바로 로그인페이지? 혹은 모달 띄워서 로그인이 필요합니다 예 아니오 클릭?

function MainPage() {
  const [comp, setComp] = useState<string>("main");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  // redux에서 닉네임을 가져오기 위해 사용함
  const { isLoggedIn, user } = useAppSelector((state) => state.user);
  const nickname = isLoggedIn ? user?.nickname : "";

  // 로그인 여부 판단
  const isLoggedin = !!localStorage.getItem("accessToken");

  // TODO : 음성재생 모달도 로그인된 상태에서만 접근 가능하도록 조치해야함
  // 음성재생 함수
  const togglePlay = () => {
    if (isLoggedin) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          setComp("voice_play");
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    } else {
      // TODO: 알림 주고 login 페이지로 보내기
      navigate("/login");
    }
  };

  useEffect(() => {
    function handleAudioEnded() {
      setIsPlaying(false);
      setTimeout(() => {
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

  const recognizeClick = () => {
    navigate("/recognize");
  };

  return (
    <div>
      <audio ref={audioRef} src={startVoice} />
      {comp === "main" ? (
        <>
          <Navbar />
          <div className="z-10 pt-14">
            {isLoggedIn ? (
              <>
                <div className="pl-[8%] pt-2 text-2xl font-bold">
                  안녕하세요, ""{user?.nickname}님!!!&nbsp;
                </div>
                <div className="flex flex-row pl-[8%] pt-1 text-sm font-medium">
                  <div className="text-red-main">히어로</div>
                  <div>에 오신 것을 환영해요 ^____^</div>
                </div>
              </>
            ) : (
              <>
                <div className="pl-[8%] pt-2 text-2xl font-bold">
                  어서오세요.
                </div>
                <div className="flex flex-row pl-[8%] pt-1 text-sm font-medium">
                  <div>회원가입 후&nbsp;</div>
                  <div className="text-red-main">히어로</div>
                  <div>를 이용해보세요.</div>
                </div>
              </>
            )}
            {/* <div className="ml-8 mr-8 pt-2">
              <Carousel />
            </div> */}

            {/* 대화 시작하기 버튼 */}
            {/* <div className="mt-4 flex justify-center">
              <button
                onClick={togglePlay}
                // onClick={commClick}
                className="m-4 mx-0 h-24 w-5/6 rounded-2xl border border-red-sub bg-red-sub text-white shadow-md"
              >
                <div className="flex h-full w-full items-center justify-center">
                  <StartConver />
                  <div className="text-left">
                    <h5 className="mb-2 text-xl font-bold">대화 시작하기</h5>
                    <p className="text-sm">누가 말하는지 알 수 있어요.</p>
                  </div>
                </div>
              </button>
            </div> */}
            {/* 수어 인식 대화 버튼, 주변 소음인식 버튼 */}
            {/* <div className="mx-2 flex flex-row items-center justify-center">
              <button
                onClick={commClick}
                className="m-3 h-48 w-2/5 rounded-2xl border border-yellow-sub bg-yellow-sub text-white shadow-md"
              >
                <div className="flex h-full w-full flex-col items-center">
                  <div className="text-center">
                    <h5 className="mb-5 mt-4 text-xl font-bold">
                      수어 인식 대화
                    </h5>
                  </div>
                  <JoinConver />
                </div>
              </button>
              <button
                onClick={recognizeClick}
                className="m-3 h-48 w-2/5 rounded-2xl border border-green-sub bg-green-sub text-white shadow-md"
              >
                <div className="flex h-full w-full flex-col items-center">
                  <div className="text-center">
                    <h5 className="mb-5 mt-4 text-xl font-bold">
                      주변 소음 인식
                    </h5>
                  </div>
                  <CheckConver />
                </div>
              </button>
          </div> */}
          </div>
        </>
      ) : comp === "voice_play" ? (
        <ConversationInfo cannotExit={true} />
      ) : null}
    </div>
  );
}

export default MainPage;
