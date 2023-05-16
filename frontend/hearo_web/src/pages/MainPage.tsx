import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { css } from "@emotion/react";
import { Layout, Button, ConversationInfo } from "@/components";
import Carousel4 from "@/assets/Carousel4.svg";
import Carousel5 from "@/assets/Carousel5.svg";
import Carousel6 from "@/assets/Carousel6.svg";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import Mainmeeting from "@/assets/Icon/Mainmeeting.json";

interface PropsType {
  setLoginModal: React.Dispatch<SetStateAction<boolean>>;
  setOpenProfileModal?: React.Dispatch<SetStateAction<boolean>>;
}
function MainPage({ setLoginModal }: PropsType) {
  const [comp, setComp] = useState<string>("main");
  const navigate = useNavigate();

  const { isLoggedIn, user } = useAppSelector((state) => state.user);
  // redux에서 닉네임을 가져오기 위해 사용함
  // const nickname = isLoggedIn ? user?.nickname : "";

  const handleCommPageClick = () => {
    (isLoggedIn) ? navigate("/comm") : setLoginModal(true);
  }

  const handleRecordPageClick = () => {
    (isLoggedIn) ? navigate("/records") : setLoginModal(true);
  };

  // 스크롤 위치에 따른 motion.div 애니메이션 구현
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {comp === "main" ? (
        <>
          <Layout>
            <div className="relative">
              {/* 안녕하세요, 000 님 */}
              <div className="flex min-h-screen w-full justify-center flex-row ">
                <div className="flex items-center">
                  <Player
                    src={Mainmeeting}
                    loop
                    autoplay
                    style={{ width: "600px", height: "300px" }}
                  />
                  <div className="sticky top-48 m-4 flex h-80 w-[50%] flex-col items-center justify-center bg-white">
                    <div className="m-4 flex flex-row items-end text-xl text-blue-main">
                      <h1 className="font-chewy text-5xl font-extrabold">
                        HEARO
                      </h1>
                      <span>&nbsp;Office</span>
                    </div>
                    {isLoggedIn ? (
                      <>
                        <div className="text-sm">
                          안녕하세요, {user?.nickname}님!!!&nbsp;
                        </div>
                        <div className="flex flex-row text-sm font-medium">
                          <div className="text-blue-main">히어로</div>
                          <div>에 오신 것을 환영해요 ^____^</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm">반가워요.</div>

                          <div className="flex flex-row text-sm font-medium">
                            <Button onClick={handleCommPageClick}>
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
                      <p className="pt-4">
                        <span className="font-semibold">
                          회사에서, 학교에서, 단체에서
                        </span>
                        회의를 위해 소리를 잇는 다리
                        <span className="text-xl font-bold text-blue-main">
                          히어로
                        </span>
                        입니다.
                      </p>
                    </div>
                    <div className="mt-8 w-40 items-center">
                      <Button
                        onClick={handleCommPageClick}
                        type="blueTextBtn"
                      >
                        이용하러 가기
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* body */}
              <section className="relative mx-4 flex flex-col justify-center gap-10">
                <motion.div
                  className="sticky top-0 m-4 flex h-screen flex-col items-center justify-center bg-white pb-8"
                  initial={{ opacity: 0, x: "-100vw" }}
                  animate={
                    scrollPosition > 200
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: "-100vw" }
                  }
                  transition={{ duration: 1.5 }}
                >
                  <div className="grid grid-cols-2 ">
                    <div className="col1">
                      {/* 회의 시작하기 */}
                      <div className="startMeeting">
                        <h3 className="text-2xl font-bold text-blue-main">
                          회의 시작하기
                        </h3>
                        <p className="my-4 text-xl">
                          <span className="font-bold">실시간</span>으로=
                          <span className="font-bold">분리</span>
                          하여 보여줍니다. 회의를 시작해서 회의장에서 당당하게
                          목소리를 내어 회의를 이끌어보세요.
                          <br />
                          <span>그리고 모든 걸 기록해서, 활용해보세요.</span>
                        </p>
                        <div className="w-1/3">
                          <Button
                            onClick={handleCommPageClick}
                            type="blueTextBtn"
                          >
                            회의 시작하기
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="col2 flex items-center justify-center">
                      <div
                        css={css`
                          background-image: url(${Carousel4});
                          background-repeat: no-repeat;
                          background-position: center;
                          background-size: contain;
                          width: 600px;
                          height: 400px;
                        `}
                      ></div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="sticky top-0 m-4 flex h-screen flex-col items-center justify-center bg-white pb-8"
                  initial={{ opacity: 0, x: "100vw" }}
                  animate={
                    scrollPosition > 700
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: "100vw" }
                  }
                  transition={{ duration: 1.5 }}
                >
                  <div className="grid grid-cols-2">
                    {/* 기록 확인하기 */}
                    <div className="col1 flex items-center justify-center">
                      <div
                        css={css`
                          background-image: url(${Carousel5});
                          background-repeat: no-repeat;
                          background-position: center;
                          background-size: contain;
                          width: 600px;
                          height: 300px;
                        `}
                      ></div>
                    </div>
                    <div className="col2">
                      <h3 className="text-2xl font-bold text-blue-main">
                        회의 기록 확인
                      </h3>
                      <p className="my-4 text-xl">
                        기록한 회의를 확인해보세요. 회의 중에 남긴 메모도 확인할
                        수 있고, 회의록에 따라{" "}
                        <span className="font-bold">chatGPT</span> 으로부터{" "}
                        <span className="font-bold">todo-list도 추천</span> 받을
                        수 있어요!
                        <br />
                        <span>
                          회의록의 제목을 수정할 수 있고, 음성을 재생할 수
                          있어요!
                        </span>
                      </p>
                      <div className="w-1/3">
                        <Button
                          onClick={handleRecordPageClick}
                          type="blueTextBtn"
                        >
                          회의 기록 확인하기
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="sticky top-0 m-4 flex h-screen flex-col items-center justify-center bg-white pb-8"
                  initial={{ opacity: 0, x: "-150vw" }}
                  animate={
                    scrollPosition > 1500
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: "-100vw" }
                  }
                  transition={{ duration: 2 }}
                >
                  <div className="grid grid-cols-2 ">
                    <div className="col1">
                      {/* 회의 시작하기 */}
                      <div className="startMeeting">
                        <h3 className="text-2xl font-bold text-blue-main">
                          메모 확인하기
                        </h3>
                        <p className="my-4 text-xl">
                          <span className="font-bold">실시간</span> 으로
                          <span className="font-bold">분리</span>
                          하여 보여줍니다.
                        </p>
                        <div className="w-1/3">
                          <Button
                            onClick={handleCommPageClick}
                            type="blueTextBtn"
                          >
                            메모 보러가기
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="col2 flex items-center justify-center">
                      <div
                        css={css`
                          background-image: url(${Carousel6});
                          background-repeat: no-repeat;
                          background-position: center;
                          background-size: contain;
                          width: 600px;
                          height: 300px;
                        `}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              </section>
              <div className="h-24 w-full"></div>
            </div>
          </Layout>
          
          {/* footer */}
          <footer className="h-72 bg-blue-950">
            <div className="p-4 pb-2">
              <div className="flex flex-row items-end">
                <h5 className="font-chewy text-4xl font-bold text-white">
                  Hearo
                </h5>
                <span className="text-2xl font-medium text-white">
                  &nbsp;Office
                </span>
              </div>
              <p className="flex w-full justify-start text-lg text-white">
                소리를 잇는 연결고리
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 px-4 py-0 pb-6">
              <div className="flex flex-col items-center justify-center text-white">
                <div className="text-lg font-light">CICD / AI</div>
                <div className="text-2xl font-semibold">박장훈</div>
              </div>
              <div className="flex flex-col items-center justify-center text-white">
                <div className="text-lg font-light">IoT</div>
                <div className="pb-4 text-2xl font-semibold">홍영민</div>
                <div className="text-lg font-light">백엔드</div>
                <div className="text-2xl font-semibold">김나연</div>
              </div>
              <div className="flex flex-col items-center justify-center text-white">
                <div className="text-lg font-light">Web 프론트엔드</div>
                <div className="pb-4 text-2xl font-semibold">
                  노현정, 남기성
                </div>
                <div className="text-lg font-light">App 프론트엔드</div>
                <div className="text-2xl font-semibold ">김동준</div>
              </div>
            </div>
            <div className="bottom-0 flex justify-center align-baseline font-chewy text-2xl text-white">
              &copy; Hearo by SSAFY A603 srp
            </div>
          </footer>
        </>
      ) : null}
    </div>
  );
}

export default MainPage;
