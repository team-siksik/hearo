import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { css } from "@emotion/react";
import { Layout, Button, ConversationInfo } from "@/components";
import screenshot1 from "@/assets/screenshot1.png";
import screenshot2 from "@/assets/screenshot2.png";
import screenshot3 from "@/assets/screenshot3.png";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import Mainmeeting from "@/assets/Icon/Mainmeeting.json";
import { getUserSetting } from "@/redux/modules/profile";
import { getUserInfo } from "@/redux/modules/user";

interface PropsType {
  setLoginModal: React.Dispatch<SetStateAction<boolean>>;
  setOpenProfileModal?: React.Dispatch<SetStateAction<boolean>>;
}
function MainPage({ setLoginModal }: PropsType) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [comp, setComp] = useState<string>("main");

  const { isLoggedIn, user } = useAppSelector((state) => state.user);
  // redux에서 닉네임을 가져오기 위해 사용함
  // const nickname = isLoggedIn ? user?.nickname : "";
  const accessToken = sessionStorage.getItem("accessToken");
  const singleId = sessionStorage.getItem("userSeq");
  useEffect(() => {
    dispatch(getUserInfo({ accessToken: accessToken!, singleId: singleId! }));
  }, []);

  const handleCommPageClick = () => {
    isLoggedIn ? navigate("/comm") : setLoginModal(true);
  };

  const handleRecordPageClick = () => {
    isLoggedIn ? navigate("/records") : setLoginModal(true);
  };

  const isDesktop = () => {
    return true;
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
              <div className="flex min-h-screen w-full flex-row justify-center ">
                <div className="flex items-center">
                  <Player
                    src={Mainmeeting}
                    loop
                    autoplay
                    style={{ width: "600px", height: "300px" }}
                  />
                  <div className="sticky top-48 m-4 flex h-80 w-[50%] flex-col items-start justify-center bg-white">
                    <div className="text-blue-main">
                      <p className="text-l mb-1 font-semibold">
                        소리를 잇는 다리,
                      </p>
                      <p>
                        <span className="mr-1 font-chewy text-5xl font-extrabold">
                          HEARO
                        </span>
                        <span className="text-xl">Office</span>
                      </p>
                    </div>
                    <div className="mt-4">
                      <p>회사에서, 학교에서, 회의가 필요한 어디에서나</p>
                      <p>
                        <span className="text-blue-main">Hearo Office</span>를
                        통해 회의에 편하게 참여하세요!
                      </p>
                    </div>
                    <div className="mt-6 w-40 items-center">
                      <Button onClick={handleCommPageClick} type="blueTextBtn">
                        시작하기
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
                      : { opacity: 0, x: "-30vw" }
                  }
                  transition={{ duration: 1 }}
                >
                  <div className="grid grid-cols-2 ">
                    <div className="col1">
                      {/* 회의 시작하기 */}
                      <div className="startMeeting">
                        <h3 className="text-2xl font-bold text-blue-main">
                          회의 시작하기
                        </h3>
                        <div className="my-4 text-xl">
                          <div>
                            나누는 이야기를 실시간으로 확인할 수 있습니다.
                          </div>
                          <div>
                            하고 싶은 말을 Text-to-Speech로 재생할 수 있고,
                          </div>
                          <div>chatGPT로부터 말을 추천받을 수도 있어요!</div>
                          <div>중요한 내용은 메모장에 기록해 보세요.</div>
                        </div>
                        <div className="w-1/3">
                          <Button
                            onClick={handleCommPageClick}
                            type="blueTextBtn"
                          >
                            시작하기
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="col2 flex items-center justify-center">
                      <div
                        css={css`
                          background-image: url(${screenshot2});
                          background-repeat: no-repeat;
                          background-position: center;
                          background-size: contain;
                          width: 400px;
                          height: 200px;
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
                          background-image: url(${screenshot1});
                          background-repeat: no-repeat;
                          background-position: center;
                          background-size: contain;
                          width: 400px;
                          height: 200px;
                        `}
                      ></div>
                    </div>
                    <div className="col2">
                      <h3 className="text-2xl font-bold text-blue-main">
                        회의 기록들 한눈에 보기
                      </h3>
                      <p className="my-4 text-xl">
                        진행한 회의를 한눈에 확인할 수 있어요.
                      </p>
                      <div className="w-1/3">
                        <Button
                          onClick={handleRecordPageClick}
                          type="blueTextBtn"
                        >
                          보러가기
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
                          내 기록 보기
                        </h3>
                        <p className="my-4 text-xl">
                          회의에서 나눈 이야기와 작성한 메모를 확인할 수 있어요.
                        </p>
                        <div className="w-1/3">
                          <Button
                            onClick={handleCommPageClick}
                            type="blueTextBtn"
                          >
                            보러가기
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="col2 flex items-center justify-center">
                      <div
                        css={css`
                          background-image: url(${screenshot3});
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
          <footer className="bg-neutral-700 px-20 py-10 text-sm leading-6 text-gray-300">
            <div className="mb-3">
              서비스 이용약관 | 개인정보 처리방침 | 회사 안내
            </div>
            <div className="mb-3">
              <p>김동준 | 팀장, Frontend</p>
              <p>김나연 | Backend, AI</p>
              <p>남기성 | Frontend</p>
              <p>노현정 | Frontend</p>
              <p>박장훈 | CI/CD, AI</p>
              <p>홍영민 | Iot, Backend</p>
            </div>
            <div>
              <p>
                주식회사 히어로 | 대표 김동준 | 서울특별시 강남구 역삼동
                테헤란로 212
              </p>
              <p>사업자 등록 번호 000-00-00000</p>
              <p>
                <span className="mr-1 font-chewy">HEARO</span>
                &copy; 2023 by TEAM 6_6, Inc. All rights reserved.
              </p>
            </div>
          </footer>
        </>
      ) : null}
    </div>
  );
}

export default MainPage;
