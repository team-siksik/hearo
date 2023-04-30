import React, { useEffect, useState } from "react";
import { ArrowLeftIcon} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";


function SettingsPage() {
  const mypagebarBackground = "z-10 bg-white drop-shadow";
  const navigate = useNavigate();
  const backClick = () => {
    navigate('/mypage');
  }


  return (
  <div>
    <div className={`${mypagebarBackground} flex flex-row p-2.5 w-full h-full`}>
      <div>
        <ArrowLeftIcon className="w-8 h-8" onClick={backClick} />
      </div>
      <div className="pl-[30%] font-bold text-3xl ">
        환경설정
      </div>
    </div>
    <div className="px-4 py-2 space-y-4"> 
      <div > 
        글자크기 설정
        크기 대로~
      </div>
      <div> 
        음성 설정
        여성 기본
        남성
      </div>
    </div>
  </div>
  )
}

export default SettingsPage;