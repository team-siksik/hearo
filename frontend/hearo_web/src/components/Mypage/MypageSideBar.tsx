import React from "react";
import Button from "../common/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  BookOpenIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

// TODO: 로그인된 상태에서 AUTH TOKEN 들고다녀야함

function MypageSideBar() {
  const navigate = useNavigate();
  const isLoggedin = !!localStorage.getItem("access_token");
  
  const handleConversationPageClick = () => {
    navigate('/comm')
  }

  const handleRecordPageClick = () => {
    navigate('/records')
  }

  // 로그인된 상태에서만 MyPage로 이동
  const handleMypageClick = () => {
      navigate("/mypage");
    }

  // 로그인된 상태에서만 MyPage로 이동
  // const handleMypageClick = () => {
  //   if (isLoggedin) {
  //     navigate("/mypage");
  //   } else {
  //     로그인되어 있지 않은 경우 로그인 페이지로 이동하도록 처리
  //     navigate("/login");
  //     setLoginModal(true);
  //   }
  // };


  return (
    <div className="fixed top-16 left-0 h-full w-[18%] min-w-fit border border-slate-200 bg-slate-50">
      <div className="flex h-full flex-col text-xl font-semibold">
        <div className="w-full border-b border-slate-200">
          <div className="h-[10%] w-[80%] m-6 items-center">
          <Button onClick={handleConversationPageClick} type="blueTextBtn">
            회의 시작하기
          </Button>
          </div>
        </div>
        <div onClick={handleRecordPageClick} className="flex h-[10%] w-full items-center border-b border-slate-200 hover:bg-blue-main hover:text-white hover:cursor-pointer">
          <div className="m-6 flex flex-row">
            <div className="w-7 h-7 p-1">
            <BookOpenIcon/>
            </div>
            내 기록
          </div>
        </div>
        <div onClick={handleMypageClick} className="flex h-[10%] w-full items-center border-b border-slate-200 hover:bg-blue-main hover:text-white hover:cursor-pointer">
          <div className="m-6 flex flex-row">
            <div className="w-7 h-7 p-1">
            <Cog6ToothIcon/>
            </div>
            내 정보
          </div>
        </div>
      </div>
    </div>
  );
}

export default MypageSideBar;
