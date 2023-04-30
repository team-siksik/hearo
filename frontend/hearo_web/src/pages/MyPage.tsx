import React from "react";
import { ArrowLeftIcon, BookmarkIcon, Cog6ToothIcon, InformationCircleIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

function Mypage() {
  const mypagebarBackground = "z-10 bg-white drop-shadow";
  const navigate = useNavigate();
  const homeClick = () => {
    navigate('/');
  }

  const FavClick = () => {
    navigate('/favcontents')
  }

  const SettingClick = () => {
    navigate('/settings')
  }

  const AgainClick = () => {
    navigate('/again')
  }
  
  return (
    <div> 
      <div className={`${mypagebarBackground} flex flex-row p-2.5 w-full h-full`}> 
        <div>
          <ArrowLeftIcon className="w-8 h-8" onClick={homeClick}/>
        </div>
        <div className="pl-[30%] font-bold text-3xl ">
          내 정보
        </div>  
      </div>
      <div className="m-4 pt-4 flex flex-col text-center justify-center">
        <div className="pt-1 font-bold text-3xl">
          김도미닉
        </div>
        <div className="pt-1 font-light text-1.5xl">
          cutekitty@gmail.com
        </div>
      </div>  
      <hr className="bg-black opacity-10 h-0.5 m-4"/>
      <div onClick={FavClick} className="p-3 flex flex-row justify-between">
          <div className="flex flex-row pl-4 pr-4 text-2xl font-bold">
          <BookmarkIcon className="w-6 h-6 m-1 mr-2"/>
            자주쓰는 말
          </div>
          <ChevronRightIcon className="w-6 h-6 m-1"/>
      </div>
      <hr className="bg-black opacity-20 h-0.5 m-4"/>
      <div onClick={SettingClick} className="p-3 flex flex-row justify-between">
          <div className="flex flex-row pl-4 pr-4 text-2xl font-bold">
          <Cog6ToothIcon className="w-6 h-6 m-1 mr-2"/>
            환경설정
          </div>
          <ChevronRightIcon className="w-6 h-6 m-1"/>
      </div>
      <hr className="bg-black opacity-10 h-0.5 m-4"/>
      <div onClick={AgainClick} className="p-3 flex flex-row justify-between">
          <div className="flex flex-row pl-4 pr-4 text-2xl font-bold">
          <InformationCircleIcon className="w-6 h-6 m-1 mr-2"/>
            튜토리얼 다시보기
          </div>
          <ChevronRightIcon className="w-6 h-6 m-1"/>
      </div>
      <hr className="bg-black opacity-20 h-0.5 m-4"/>

      <div className="flex flex-row justify-center m-8 mt-[80%]">
        <div className="p-8 text-2xl font-bold text-red-main opacity-80">
          로그아웃
        </div>
        <div className="p-8 text-2xl font-bold text-black opacity-50">
          회원탈퇴
        </div>
      </div>
    </div>
  )
}

export default Mypage;
