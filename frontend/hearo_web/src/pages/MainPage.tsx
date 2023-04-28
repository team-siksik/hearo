import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/common/Navbar/Navbar";
import Carousel from "@/components/common/Carousel/Carousel";
import { SelectedPage } from "@/types/types";
import { ReactComponent as Image1 } from "../assets/start_conver.svg";
import { ReactComponent as Image2 } from "../assets/join_conver.svg";
import { ReactComponent as Image3 } from "../assets/check_conver.svg";

function MainPage() {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(
    SelectedPage.CommunicationPage
  );
  const navigate = useNavigate();

  const commClick = () => {
    navigate('/comm');
  }

  const recordsClick = () => {
    navigate('/records');
  }

  return (
    <div>
      <Navbar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <div className="pt-14">
        <div className="pl-[8%] pt-2 text-2xl">
        안녕하세요, 김갓팀장님!!!
        </div>
        <div className="pl-[8%] pt-1 text-sm">
        히어로에 오신 것을 환영해요 ^____^ 
        </div>
        <div className="ml-8 mr-8 pt-2"> 
          <Carousel/>
        </div>

        {/* 대화 시작하기 버튼 */}
        <div className="flex justify-center mt-4"> 
          <button
          onClick={commClick}
          className="m-5 h-24 w-80 rounded-2xl border border-red-sub bg-red-sub text-white shadow-md"
          >
            <div className="flex h-full items-center justify-center">
              <Image1 />
              <div className="text-left">
                <h5 className="mb-2 text-base font-bold">대화 시작하기</h5>
                <p className="text-xs">상대방과의 대화를 시작해요.</p>
              </div>
            </div>
          </button>
        </div>
        <div className="flex flex-row items-center justify-center pt-2">
          <button
          onClick={commClick}
          className="m-3 h-48 w-40 rounded-2xl border border-yellow-sub bg-yellow-sub text-white shadow-md"
          >
            <div className="flex flex-col w-full h-full items-center">
              <div className="text-center">
                <h5 className="mb-2 mt-4 text-base font-bold">대화 참여하기</h5>
              </div>
              <Image2/>
            </div>
          </button>
          <button
          onClick={recordsClick}
          className="m-3 h-48 w-40 rounded-2xl border border-green-sub bg-green-sub text-white shadow-md"
            >
            <div className="flex flex-col w-full h-full items-center">
              <div className="text-center">
                <h5 className="mb-2 mt-4 text-base font-bold">기록 확인하기</h5>
              </div>
              <Image3/>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;