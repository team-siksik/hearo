import React, { useEffect, useState } from "react";
import { ArrowLeftIcon} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

function AgainPage() {
  const mypagebarBackground = "z-10 bg-white drop-shadow";
  const navigate = useNavigate();

  return (
  <div>
    <div className={`${mypagebarBackground} flex flex-row p-2.5 w-full h-full`}>
      <div>
        <ArrowLeftIcon className="w-8 h-8" onClick={() => navigate(-1)} />
      </div>
      <div className="pl-[15%] font-bold text-3xl ">
        튜토리얼 다시보기
      </div>
    </div>
    <div className="px-4 py-2 space-y-4"> 
      <div className="text-4xl font-semibold text-red-main"> 
        튜토리얼페이지
      </div>
    </div>
  </div>
  )
}

export default AgainPage;