import React, { useState, useEffect } from "react";
import Button from "../common/ui/Button";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeftIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

// TODO: 로그인된 상태에서 AUTH TOKEN 들고다녀야함

function ConvertBar() {
  const navigate = useNavigate();
  const [loginModal, setLoginModal] = useState(false);
  const isLoggedin = !!localStorage.getItem("access_token");
  const location = useLocation();

  const handleConversationPageClick = () => {
    navigate("/comm");
  };

  const handleRecordPageClick = () => {
    navigate("/records");
  };

  const [isSettingClickFocused, setIsSettingClickFocused] = useState(true);
  useEffect(() => {
    // console.log(location.pathname)
    const parseurl = location.pathname.split("/mypage/")[1];
    function check() { 
      if (parseurl === 'settings')
      return setIsSettingClickFocused(true)
      else {
        return setIsSettingClickFocused(false);
      }
    }
    check();
  }, [location.pathname]);
  
  const SettingClick = () => {
    navigate("/mypage/settings");
  };

  const FavClick = () => {
    navigate("/mypage/frequent");
  };

  // 로그인된 상태에서만 MyPage로 이동
  const handleMypageClick = () => {
    if (isLoggedin) {
      navigate("/mypage");
    } else {
      // 로그인되어 있지 않은 경우 로그인 모달이뜨도록 처리
      setLoginModal(true);
    }
  };

  // TODO: 클릭하자마자 바로 변경되어야해
  return (
    <>
      <div className="fixed right-0 mx-10 mt-6 h-16 w-[76%] rounded-t-2xl shadow-md shadow-gray-200">
        <div className="mx-4 flex h-8 justify-start px-4 pt-4 text-xl">
          {isSettingClickFocused ? (
            <>
              <button
                onClick={SettingClick}
                className="flex h-10 flex-row justify-between border-b-4 border-blue-main text-blue-main hover:cursor-pointer"
              >
                <div className="flex flex-row text-2xl font-light">
                  <Cog6ToothIcon className="m-1 mr-2 h-6 w-6" />내 프로필
                </div>
              </button>
              <button
                onClick={FavClick}
                className="ml-4 flex h-10 flex-row justify-between text-black hover:cursor-pointer hover:text-blue-main"
              >
                <div className="flex flex-row text-2xl font-light">
                  <BookmarkIcon className="m-1 mr-2 h-6 w-6" />
                  자주쓰는 말
                </div>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={SettingClick}
                className="flex h-10 flex-row justify-between text-black hover:cursor-pointer hover:text-blue-main"
              >
                <div className="flex flex-row text-2xl font-light">
                  <Cog6ToothIcon className="m-1 mr-2 h-6 w-6" />내 프로필
                </div>
              </button>
              <button
                onClick={FavClick}
                className="ml-4 flex h-10 flex-row justify-between hover:cursor-pointer border-b-4 border-blue-main text-blue-main"
              >
                <div className="flex flex-row text-2xl font-light">
                  <BookmarkIcon className="m-1 mr-2 h-6 w-6" />
                  자주쓰는 말
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ConvertBar;
