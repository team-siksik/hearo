import React from "react";
import { ArrowLeftIcon} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

function RecognizePage() {
    const mypagebarBackground = "z-10 bg-white drop-shadow";
    const navigate = useNavigate();
  
  return (
  <div>
  <div>
    <div className={`${mypagebarBackground} flex flex-row p-2.5 w-full h-full`}>
      <div>
        <ArrowLeftIcon className="w-8 h-8" onClick={() => navigate(-1)} />
      </div>
      <div className="pl-[22%] font-bold text-3xl ">
        주변소음인식
      </div>
    </div>
    <div className="px-4 py-2 space-y-4 text-center"> 
      <div className="text-4xl font-semibold text-red-main"> 
        주변소음인식페이지
      </div>
    </div>
  </div>
    
  </div>
  )
}
export default RecognizePage;
