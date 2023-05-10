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

// TODO: 로그인 설정 다 해놔야됨
// TODO: 대화 시작하기 클릭할 때 전체가 가려져야 함

interface PropsType {
  setLoginModal: React.Dispatch<SetStateAction<boolean>>;
}
const Navbar = ({ setLoginModal }: PropsType) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);
  const flexBetween = "flex items-center justify-between";
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const navbarBackground = "z-10 bg-white drop-shadow";
  // 로그인여부
  const isLoggedin = !!localStorage.getItem("access_token");
  const user = useAppSelector((state) => state.user);
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

  function openLoginModal() {
    setLoginModal(true);
  }

  return (
    <header className="flex justify-between border border-gray-200 py-2">
      <div className="logo font-chewy text-3xl font-extrabold text-blue-main">
        <button onClick={homeClick} className="flex items-center ">
          <Player src={MainLogo} loop autoplay style={{ width: "60px" }} />
          <h1>HEARO</h1>
        </button>
      </div>
      <nav></nav>
      {isLoggedin ? (
        <section
          onClick={() => setOpenProfileModal(true)}
          className="user-box mx-4 flex items-center"
        >
          <div className="w-7" onClick={handleLogoutClick}>
            <UserIcon />
          </div>
          <p>{user?.user?.nickname} 님</p>
          {/* <p>김야옹 님</p> */}
        </section>
      ) : (
        <section className="user-box">
          <div className="px-3">
            <Button type="whiteButton" onClick={openLoginModal}>
              <img className="mx-3 w-5" src={google_logo} />
            </Button>
          </div>
        </section>
      )}
    </header>
  );
};

export default Navbar;
