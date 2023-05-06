import React, { SetStateAction, useEffect, useRef, useState } from "react";
import startVoice from "@/assets/Sounds/start.wav";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { css } from "@emotion/react";
import {
  Navbar,
  Layout,
  Button,
  ConversationInfo,
  LoginModal,
} from "@/components";
import Carousel2 from "@/assets/Carousel2.png";

interface PropsType {
  setLoginModal: React.Dispatch<SetStateAction<boolean>>;
}
function MainPage({ setLoginModal }: PropsType) {
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
    if (!isLoggedin) {
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

  return (
    <div>
      <audio ref={audioRef} src={startVoice} />
      {comp === "main" ? (
        <>
          {/* <Navbar setLoginModal={setLoginModal} /> */}
          <Layout>
            <div className="relative">
              {/* 안녕하세요, 000 님 */}
              <div className="sticky top-0 m-4 flex h-72 flex-col items-center justify-center bg-white">
                {isLoggedIn ? (
                  <>
                    <div>안녕하세요, ""{user?.nickname}님!!!&nbsp;</div>
                    <div>
                      <div className="text-red-main">히어로</div>
                      <div>에 오신 것을 환영해요 ^____^</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className=" text-sm">반가워요.</div>
                    <div className="flex flex-row text-sm font-medium">
                      <Button onClick={() => setLoginModal(true)}>
                        <span>로그인 후&nbsp;</span>
                        <span className="font-semibold text-blue-main">
                          히어로
                        </span>
                      </Button>
                      <span>를 이용해보세요.</span>
                    </div>
                  </>
                )}
                <div>
                  <p>
                    <span className="font-semibold">
                      회사에서, 학교에서, 단체에서
                    </span>{" "}
                    회의를 위해 소리를 잇는 다리{" "}
                    <span className="text-xl font-bold text-blue-main">
                      히어로
                    </span>
                    입니다.{" "}
                  </p>
                </div>
              </div>
              {/* body */}
              <section className="mx-4 flex flex-col gap-10">
                <div className="sticky top-0 m-4 flex h-screen flex-col items-center justify-center bg-white  pb-8">
                  <div className="grid grid-cols-2 ">
                    <div className="col1">
                      {/* 회의 시작하기 */}
                      <div className="startMeeting">
                        <h3 className="text-xl font-bold">회의 기록하기</h3>
                        <p className="my-4">
                          일반 speech-to-text 앱들과는 달리, 히어로에서는{" "}
                          <span className="font-bold">실시간</span> 으로{" "}
                          <span className="font-bold">화자</span>를{" "}
                          <span className="font-bold">분리</span>
                          하여 보여줍니다. 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구
                          쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라
                          어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구
                          저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구
                          쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라
                          어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구
                          저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구
                          쏼라쏼라 어쩌구 저쩌구 쏼라쏼라
                        </p>
                        <div className="w-1/3">
                          <Button onClick={togglePlay} type="blueTextBtn">
                            회의 시작하기
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="col2 flex items-center justify-center">
                      <div
                        css={css`
                          background-image: url(${Carousel2});
                          background-repeat: no-repeat;
                          background-position: center;
                          background-size: contain;
                          width: 600px;
                          height: 200px;
                        `}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="sticky top-0 m-4 flex h-screen flex-col items-center justify-center bg-white  pb-8">
                  <div className="grid grid-cols-2">
                    {/* 기록 확인하기 */}
                    <div className="col1 flex items-center justify-center">
                      <div
                        css={css`
                          background-image: url(${Carousel2});
                          background-repeat: no-repeat;
                          background-position: center;
                          background-size: contain;
                          width: 600px;
                          height: 200px;
                        `}
                      ></div>
                    </div>
                    <div className="col2">
                      <h3 className="text-xl font-bold">회의 기록 확인하기</h3>
                      <p className="my-4">
                        기록한 회의를 확인해보세요. 회의 중에 남긴 메모도 확인할
                        수 있고, 회의록에 따라{" "}
                        <span className="font-bold">chatGPT</span> 으로부터{" "}
                        <span className="font-bold">todo-list도 추천</span> 받을
                        수 있어요! 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라
                        어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구
                        저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구
                        쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라
                        어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구
                        저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구
                        쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라
                        어쩌구 저쩌구 쏼라쏼라
                      </p>
                      <div className="w-1/3">
                        <Button type="blueTextBtn">회의 기록 확인하기</Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sticky top-0 m-4 flex h-screen flex-col items-center justify-center bg-white  pb-8">
                  <div className="grid grid-cols-2">
                    <div className="col1">
                      {/* 회의 시작하기 */}
                      <div className="writeReport">
                        <h3 className="text-xl font-bold">회의록 작성하기</h3>
                        <p className="my-4">
                          저장되어있는 회의 기록을 바탕으로
                          <span className="font-bold"> 회의록</span>을 작성 및
                          수정해보세요. 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구
                          쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라
                          어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구
                          저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구
                          쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라
                          어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구
                          저쩌구 쏼라쏼라 어쩌구 저쩌구 쏼라쏼라 어쩌구 저쩌구
                          쏼라쏼라 어쩌구 저쩌구 쏼라쏼라
                        </p>
                        <div className="w-1/3">
                          <Button type="blueTextBtn">회의록 작성하기</Button>
                        </div>
                      </div>
                    </div>
                    <div className="col2 flex items-center justify-center">
                      <div
                        css={css`
                          background-image: url(${Carousel2});
                          background-repeat: no-repeat;
                          background-position: center;
                          background-size: contain;
                          width: 600px;
                          height: 200px;
                        `}
                      ></div>
                    </div>
                  </div>
                </div>
              </section>
              <div className="h-24 w-full"></div>
            </div>
          </Layout>
          {/* footer */}
          <footer className="h-72 bg-slate-700">
            <div className="p-4">
              <h5 className="font-chewy text-2xl text-white">Hearo</h5>
              <p className="font-nanum text-white">소리를 잇는 연결고리</p>
            </div>
            <div className="grid grid-cols-3 p-4">
              <div>
                <div>CICD / AI</div>
              </div>
              <div>
                <div>IoT</div>
                <div>백엔드</div>
              </div>
              <div>
                <div>웹 프론트엔드</div>
                <div>앱 프론트엔드</div>
              </div>
            </div>
          </footer>
        </>
      ) : comp === "voice_play" ? (
        // 음성 재생 -> 회의 시작 페이지로 자동 이동
        <ConversationInfo cannotExit={true} />
      ) : null}
    </div>
  );
}

export default MainPage;
