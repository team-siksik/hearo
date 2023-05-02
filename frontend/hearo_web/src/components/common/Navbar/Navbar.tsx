import React, {useEffect, useState, useRef} from "react";
import { useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Test1 from "@/assets/Hearo_logo.png"
import { AnimatePresence, motion } from "framer-motion";
import { SelectedPage } from "@/types/types";
import { ReactComponent as Start } from "@/assets/StartConver.svg";
import { ReactComponent as Join } from "@/assets/JoinConver.svg";
import { ReactComponent as Check } from "@/assets/CheckConver.svg";
import { ReactComponent as SettingIcon} from "@/assets/SettingIcon.svg";
import { ReactComponent as LogoutIcon} from "@/assets/LogoutIcon.svg";
import { ReactComponent as LoginIcon} from "@/assets/LoginIcon.svg";
import { ConversationInfo } from "@/components";
import startVoice from "@/assets/start.wav";

// 유저정보가 있으면 로그인상태, 없으면 로그아웃상태 

// 로그인, 로그아웃 여부를 위한 token 함수
const insertedToken = localStorage.getItem('access_token');

// TODO : 로그인 설정 다 해놔야됨
// TODO : 대화 시작하기 클릭할 때 전체가 가려져야 함
const Navbar = () => {
  const navigate = useNavigate();
  const flexBetween = "flex items-center justify-between";
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const navbarBackground = "z-10 bg-white drop-shadow";

  const links = [
    { image: <Start width={100} height={100}/>,  name: "대화 시작하기", to:"comm", id:1},
    { image: <Join width={100} height={100} />, name: "대화 참여하기", to: "comm", id:2},
    { image: <Check width={100} height={100}/>, name: "기록 확인하기", to: "records", id:3},
  ]


  // 음성재생 컴포넌트 활용 
  const [comp, setComp] = useState<string>("main");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 음성재생 함수
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

  const homeClick = () => {
    navigate("/");
  };
  const handleMypageClick = () => {
    navigate("/mypage");
    setIsMenuToggled(false);
  };

  const handleLoginClick = () => {
    navigate('/login')
    setIsMenuToggled(false);
  }

  const handleLogoutClick = () => {
    localStorage.removeItem('access_token');
    navigate('/logout');
    setIsMenuToggled(false);
  };

  const sideVariants = {
    open: {
      transition: {
        duration:0.4,
      },
      width:280
    },
    closed: {
      transition: {
        duration:0.3,
      },
      width: 0,
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
  };

  // TODO : BAR 외부 클릭했을 때만 없어져야함 
  // const menuRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     const target = event.target as HTMLElement; // 타입 단언
  //     if (menuRef.current && !menuRef.current.contains(target)) {
  //       setIsMenuToggled(false);
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [menuRef]);
  
  return (
      <div>
          <div className={`${navbarBackground} ${flexBetween} fixed top-0 z-10 w-full py-2`}>
              <div className={`${flexBetween} mx-auto w-11/12`}>
                <div className={`${flexBetween} w-full gap-16`}>
                  {/* LEFT SIDE */}
                  <img onClick={homeClick} alt="logo" src={Test1} className="h-10 w-30"/>
                  <button
                      className="rounded-full bg-white p-1"
                      onClick={() => setIsMenuToggled(!isMenuToggled)}>
                        <Bars3Icon className="h-6 w-6 text-black" />
                  </button>
                </div>
              </div>
            </div>

            {/* 버튼 클릭시 오른쪽에서 나오는 상태창*/}
            <audio ref={audioRef} src={startVoice} />
            {comp === "main" ? (
            <>
              <AnimatePresence>
              {isMenuToggled && (
              <motion.aside
              // ref={menuRef}
              initial={{width: 0}}
              animate={{
                width: 412,
                transition: {
                  duration:0.2
                } 
              }}
              exit={{
                  width: 0,
                  transition: {
                  duration:0.2
                  }
                }}>
                <motion.div 
                  className="fixed right-0 bottom-0 z-40 h-full bg-white drop-shadow-xl"
                  initial="closed"
                  animate='open'
                  exit='closed'
                  variants={sideVariants}
                  >
                  {/* CLOSE ICON */}
                    <motion.div className="flex justify-end h-14 p-2" variants={itemVariants}>
                      <button
                        className="rounded-full bg-white mt-1 mr-2 h-8 p-1"
                        onClick={() => setIsMenuToggled(!isMenuToggled)}>
                          <XMarkIcon className="h-6 w-6 text-black" />
                      </button>
                    </motion.div>

                  {/* Navbar 메뉴 */}
                  <div className="mt-[10%] mx-[5%] flex flex-col gap-5">
                    <motion.div
                      key={links[0].id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95}}
                      variants={itemVariants}
                      onClick={() => {
                        togglePlay();
                        setIsMenuToggled(!isMenuToggled);
                      }}>
                      <div className="flex flex-row w-full space-x-12"> 
                        <span className="w-6 h-6">{links[0].image}</span>
                        <span className="text-2xl font-bold w-full h-28 pl-10 py-4 pt-10">{links[0].name}</span>
                      </div>
                    </motion.div>
                    {links.slice(1).map(({ image, name, to, id }) => (
                      <motion.a
                      key={id}
                      href={to}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95}}
                        variants={itemVariants}
                      >
                        <div className="flex flex-row w-full space-x-12"> 
                          <span className="w-6 h-6">{image}</span>
                          <span className="text-2xl font-bold w-full h-28 pl-10 py-4 pt-10">{name}</span>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                  <motion.div 
                    className="flex flex-col gap-3 text-lg"
                    variants={itemVariants}
                    >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95}}
                      className="mt-[60%] mx-[25%] flex flex-row gap-3 text-lg"
                      variants={itemVariants}
                      >
                    <SettingIcon className="h-6 w-6"/>
                    <button onClick={handleMypageClick}>내 정보 수정</button>
                    </motion.div>

                    {/* { token ? (
                    <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95}}
                    className="flex mx-[25%] flex-row gap-3 text-lg"
                    variants={itemVariants}
                    >
                      <LogoutIcon className="h-6 w-6"/>
                    <button onClick={handleLogoutClick}>로그아웃</button>
                  </motion.div>
                  ) : ( */}
                    <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95}}
                    className="flex mx-[25%] flex-row gap-3 text-lg"
                    variants={itemVariants}
                    >
                      <LoginIcon className="h-6 w-6"/>
                    <button onClick={handleLoginClick}> 로그인</button>
                  </motion.div>
                  {/* )} */}
                </motion.div>
              </motion.div>
              {/* 뒷배경 흐리게 */}
                  <motion.div
                    className="fixed z-20 w-full h-full bg-slate-950 bg-opacity-10 backdrop-blur-sm"
                    initial="closed"
                    animate='open'
                    exit='closed'
                    >
                  </motion.div>
                </motion.aside>
                )}
              </AnimatePresence>
              </>
            ) : comp === "voice_play" ? (
            <ConversationInfo cannotExit={true} 
            />
            ) : null}
        </div>
  );
}

export default Navbar;
