import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLogo from "@/assets/Icon/MainLogo.json";
import { AnimatePresence, motion } from "framer-motion";
import startVoice from "@/assets/Sounds/start.wav";
import google_logo from "@/assets/Google_Logo.svg";
import { GOOGLE_AUTH_URL } from "@/apis/oAuthGoogle";
import { css } from "@emotion/react";
import { useAppDispatch } from "@/redux/hooks";
import { googleLogout, userActions } from "@/redux/modules/user";
import { Player } from "@lottiefiles/react-lottie-player";
import Button from "../ui/Button";
import { ReactComponent as UserIcon } from "@/assets/Icon/UserIcon.svg";

// TODO: 로그인을 하면 useParams 써서 로그인정보를 버튼들 위에다가 띄워줘야함

// TODO: 로그인 설정 다 해놔야됨
// TODO: 대화 시작하기 클릭할 때 전체가 가려져야 함
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);
  const flexBetween = "flex items-center justify-between";
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const navbarBackground = "z-10 bg-white drop-shadow";
  // 로그인여부
  const isLoggedin = !!localStorage.getItem("access_token");

  const links = [
    {
      // image: <Start width={100} height={100} />,
      name: "대화 시작하기",
      to: "comm",
      id: 1,
    },
    {
      // image: <Join width={100} height={100} />,
      name: "수어 인식 대화",
      to: "comm",
      id: 2,
    },
    {
      // image: <Check width={100} height={100} />,
      name: "주변 소음 인식",
      to: "records",
      id: 3,
    },
  ];

  // 음성재생 컴포넌트 활용
  const [comp, setComp] = useState<string>("main");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
      // 알림을 주고 보내기
      navigate("/login");
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

  // 로고클릭 시 메인페이지로 이동
  const homeClick = () => {
    navigate("/");
  };

  // 로그인된 상태에서만 MyPage로 이동
  const handleMypageClick = () => {
    setIsMenuToggled(false);
    if (isLoggedin) {
      navigate("/mypage");
    } else {
      // 로그인되어 있지 않은 경우 로그인 페이지로 이동하도록 처리
      // navigate("/login");
      setLoginModal(true);
    }
  };

  // 로그인 버튼 클릭
  // 여기서도 accesstoken이 필요한가? 들고오도록 적용해야하나?
  const handleLoginClick = () => {
    setIsMenuToggled(false);
    navigate("/login");
  };

  // 로그아웃 버튼 클릭, accesstoken 삭제
  const handleLogoutClick = () => {
    dispatch(googleLogout(localStorage.getItem("accessToken")!));
    dispatch(userActions.logoutAction());
    setIsMenuToggled(false);
    //TODO: 로그아웃되었습니다. 알림 줘야 함
    navigate("/");
  };

  const sideVariants = {
    open: {
      transition: {
        duration: 0.5,
      },
      width: 280,
    },
    closed: {
      transition: {
        duration: 0.3,
      },
      width: 0,
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
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

  // return (
  //   <div>
  //     <div
  //       className={`${navbarBackground} ${flexBetween} fixed top-0 z-10 w-full py-2`}
  //     >
  //       <div className={`${flexBetween} mx-auto w-11/12`}>
  //         <div className={`${flexBetween} w-full gap-16`}>
  //           {/* LEFT SIDE */}
  //           <img
  //             onClick={homeClick}
  //             alt="logo"
  //             src={Test1}
  //             className="w-30 h-10"
  //           />
  //           <button
  //             className="rounded-full bg-white p-1"
  //             onClick={() => setIsMenuToggled(!isMenuToggled)}
  //           >
  //             <Bars3Icon className="h-6 w-6 text-black" />
  //           </button>
  //         </div>
  //       </div>
  //     </div>

  //     {/* 버튼 클릭시 오른쪽에서 나오는 상태창*/}
  //     <audio ref={audioRef} src={startVoice} />
  //     {comp === "main" ? (
  //       <>
  //         <AnimatePresence>
  //           {isMenuToggled && (
  //             <motion.aside
  //               // ref={menuRef}
  //               initial={{ width: 0 }}
  //               animate={{
  //                 width: 412,
  //                 transition: {
  //                   duration: 0.2,
  //                 },
  //               }}
  //               exit={{
  //                 width: 0,
  //                 transition: {
  //                   duration: 0.2,
  //                 },
  //               }}
  //             >
  //               <motion.div
  //                 className="fixed bottom-0 right-0 z-40 h-full bg-white drop-shadow-xl"
  //                 initial="closed"
  //                 animate="open"
  //                 exit="closed"
  //                 variants={sideVariants}
  //               >
  //                 {/* CLOSE ICON */}
  //                 <motion.div
  //                   className="flex h-14 justify-end p-2"
  //                   variants={itemVariants}
  //                 >
  //                   <button
  //                     className="mr-2 mt-1 h-8 rounded-full bg-white p-1"
  //                     onClick={() => setIsMenuToggled(!isMenuToggled)}
  //                   >
  //                     <XMarkIcon className="h-6 w-6 text-black" />
  //                   </button>
  //                 </motion.div>

  //                 {/* Navbar 메뉴 */}
  //                 <div className="mx-[5%] mt-[10%] flex flex-col gap-5">
  //                   {/* 대화 시작하기 */}
  //                   <motion.div
  //                     key={links[0].id}
  //                     whileHover={{ scale: 1.1 }}
  //                     whileTap={{ scale: 0.95 }}
  //                     variants={itemVariants}
  //                     onClick={() => {
  //                       togglePlay();
  //                       setIsMenuToggled(!isMenuToggled);
  //                     }}
  //                   >
  //                     <div className="flex w-full flex-row space-x-12">
  //                       <span className="h-6 w-6">{links[0].image}</span>
  //                       <span className="h-28 w-full py-4 pl-10 pt-10 text-2xl font-bold">
  //                         {links[0].name}
  //                       </span>
  //                     </div>
  //                   </motion.div>
  //                   {/* 수어 인식 대화 */}
  //                   <motion.div
  //                     key={links[1].id}
  //                     whileHover={{ scale: 1.1 }}
  //                     whileTap={{ scale: 0.95 }}
  //                     variants={itemVariants}
  //                     onClick={() => {
  //                       togglePlay();
  //                       setIsMenuToggled(!isMenuToggled);
  //                     }}
  //                   >
  //                     <div className="flex w-full flex-row space-x-12">
  //                       <span className="h-6 w-6">{links[1].image}</span>
  //                       <span className="h-28 w-full py-4 pl-10 pt-10 text-2xl font-bold">
  //                         {links[1].name}
  //                       </span>
  //                     </div>
  //                   </motion.div>
  //                   {/* 주변 소음 인식 */}
  //                   <motion.div
  //                     key={links[2].id}
  //                     whileHover={{ scale: 1.1 }}
  //                     whileTap={{ scale: 0.95 }}
  //                     variants={itemVariants}
  //                   >
  //                     <div className="flex w-full flex-row space-x-12">
  //                       <span className="h-6 w-6">{links[2].image}</span>
  //                       <span className="h-28 w-full py-4 pl-10 pt-10 text-2xl font-bold">
  //                         {links[2].name}
  //                       </span>
  //                     </div>
  //                   </motion.div>
  //                 </div>

  //                 <motion.div
  //                   className="flex flex-col gap-3 text-lg"
  //                   variants={itemVariants}
  //                 >
  //                   <motion.div
  //                     whileHover={{ scale: 1.1 }}
  //                     whileTap={{ scale: 0.95 }}
  //                     className="mx-[25%] mt-[50%] flex flex-row gap-3 text-lg"
  //                     variants={itemVariants}
  //                   >
  //                     <SettingIcon className="h-6 w-6" />
  //                     <button onClick={handleMypageClick}>내 정보 수정</button>
  //                   </motion.div>

  //                   {/* 로그인상태면 로그아웃버튼 도출, 반대 포함 */}
  //                   {isLoggedin ? (
  //                     <motion.div
  //                       whileHover={{ scale: 1.1 }}
  //                       whileTap={{ scale: 0.95 }}
  //                       className="mx-[25%] flex flex-row gap-3 text-lg"
  //                       variants={itemVariants}
  //                     >
  //                       <LogoutIcon className="h-6 w-6" />
  //                       <button onClick={handleLogoutClick}>로그아웃</button>
  //                     </motion.div>
  //                   ) : (
  //                     <motion.div
  //                       whileHover={{ scale: 1.1 }}
  //                       whileTap={{ scale: 0.95 }}
  //                       className="mx-[25%] flex flex-row gap-3 text-lg"
  //                       variants={itemVariants}
  //                     >
  //                       <LoginIcon className="h-6 w-6" />
  //                       <button onClick={handleLoginClick}> 로그인</button>
  //                     </motion.div>
  //                   )}
  //                 </motion.div>
  //               </motion.div>
  //               {/* 뒷배경 흐리게 */}
  //               <motion.div
  //                 className="fixed z-20 h-full w-full bg-slate-950 bg-opacity-10 backdrop-blur-sm"
  //                 initial="closed"
  //                 animate="open"
  //                 exit="closed"
  //               ></motion.div>
  //             </motion.aside>
  //           )}
  //         </AnimatePresence>
  //         {loginModal && (
  //           <Modal open={true} cannotExit={false}>
  //             <div className="py-4">
  //               <p>잠깐!</p>
  //               <p className="mb-5">
  //                 <span className="font-bold text-red-main">로그인</span>을
  //                 하셔야 이용하실 수 있어요!
  //               </p>
  //               <div className="w-full">
  //                 <a href={GOOGLE_AUTH_URL}>
  //                   <button
  //                     className="rounded-xl bg-white shadow-md shadow-slate-200 "
  //                     css={css`
  //                       width: 100%;
  //                     `}
  //                   >
  //                     <div className="mx-4 flex h-10 items-center justify-center gap-2 text-center">
  //                       <img className="ml-2 w-5" src={google_logo} />
  //                       <p className="text-s  text-gray-700">
  //                         구글 아이디로 로그인
  //                       </p>
  //                     </div>
  //                   </button>
  //                 </a>
  //               </div>
  //             </div>
  //           </Modal>
  //         )}
  //       </>
  //     ) : comp === "voice_play" ? (
  //       <ConversationInfo cannotExit={true} />
  //     ) : null}

  //   </div>
  // );

  return (
    <header className="flex justify-between border border-gray-200 py-2">
      <div className="logo flex items-center font-chewy text-3xl font-extrabold text-blue-main">
        <Player src={MainLogo} loop autoplay style={{ width: "60px" }} />
        <h1>HEARO</h1>
      </div>
      <nav></nav>
      {!isLoggedin ? (
        <section
          onClick={() => setOpenProfileModal(true)}
          className="user-box mx-4 flex items-center"
        >
          <div className="w-7">
            <UserIcon />
          </div>
          {/* <p>{username} 님</p> */}
          <p>김야옹 님</p>
        </section>
      ) : (
        <section className="user-box">
          <div className="px-3">
            <Button type="whiteButton">
              <img className="mx-3 w-5" src={google_logo} />
            </Button>
          </div>
        </section>
      )}
    </header>
  );
};

export default Navbar;
