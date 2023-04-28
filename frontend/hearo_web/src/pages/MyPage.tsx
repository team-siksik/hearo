import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

function Mypage() {
  const navigate = useNavigate();
  const homeClick = () => {
    navigate('/');
  }

  return (
    <div className="flex w-full justify-between"> 
      <div className="bg-black" content="2xl" onClick={homeClick}>
        <ArrowLeftIcon/>
      </div>
      <div className="font-bold text-3xl">
        내 정보
      </div>
    </div>
  )
}

export default Mypage;
