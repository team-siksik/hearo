import React, { useEffect, useState, useRef, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import MainLogo from "@/assets/Icon/MainLogo.json";
import { AnimatePresence, motion } from "framer-motion";
import startVoice from "@/assets/Sounds/start.wav";
import google_logo from "@/assets/Google_Logo.svg";
import { GOOGLE_AUTH_URL } from "@/apis/oAuthGoogle";
import { css } from "@emotion/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { googleLogout, userActions } from "@/redux/modules/user";
import { Player } from "@lottiefiles/react-lottie-player";
import Button from "../ui/Button";
import { ReactComponent as UserIcon } from "@/assets/Icon/UserIcon.svg";


// TODO: 로그인을 하면 useParams 써서 로그인정보를 버튼들 위에다가 띄워줘야함

interface PropsType {
  setLoginModal: React.Dispatch<SetStateAction<boolean>>;
  setOpenProfileModal: React.Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({ setLoginModal, setOpenProfileModal }: PropsType) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const flexBetween = "flex items-center justify-between";
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const navbarBackground = "z-10 bg-white drop-shadow";
  const user = useAppSelector((state) => state.user.user);
  // 로그인여부
  const isLoggedIn = localStorage.getItem("accessToken") ? true : false;

  // 음성재생 컴포넌트 활용
  const [comp, setComp] = useState<string>("main");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // TODO : 음성재생 모달도 로그인된 상태에서만 접근 가능하도록 조치해야함
  // 음성재생 함수
  const togglePlay = () => {
    if (isLoggedIn) {
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
    if (isLoggedIn) {
      navigate("/mypage");
    } else {
      setLoginModal(true);
    }
  };

  const [showModal, setShowModal] = useState(false);
  function handleLogin() {
    if (!showModal) {
      setLoginModal(true); 
      setShowModal(true);
    } else {
      setLoginModal(false);
      setShowModal(false);
    }
  }

  function handleProfile() {
    if (!showModal) {
      setOpenProfileModal(true)
      setShowModal(true)
    } else {
      setOpenProfileModal(false)
      setShowModal(true)
    }
  }


  return (
    <>
    <header className="fixed z-10 top-0 left-0 w-full bg-white flex justify-between border border-gray-200 py-2">
      <div className="logo font-chewy text-3xl font-extrabold text-blue-main">
        <button onClick={homeClick} className="flex items-center ">
          <Player src={MainLogo} loop autoplay style={{ width: "60px" }} />
          <h1>HEARO</h1>  
        </button>
      </div>
      <nav></nav>
      {isLoggedIn && user ? (
        <section
          onClick={handleProfile}
          className="user-box mx-4 flex items-center"
        >
          <div className="w-7">

            <div
              className="h-5 w-5 rounded"
              css={css`
                background-image: url(${user?.profileImg});
                background-position: center;
                background-size: cover;
              `}
            ></div>
          </div>
          <p className="hover:cursor-pointer">{user?.nickname} 님</p>
          {/* <p>김야옹 님</p> */}
        </section>
      ) : (
        <section className="user-box">
          <div className="px-3">
            <Button type="accountButton" onClick={handleLogin}>
              <img className="mx-3 w-5" src={google_logo} />
            </Button>
          </div>
        </section>
        )
    }
    </header>
  </>
  );
};

export default Navbar;
