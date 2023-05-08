import React, { useState } from "react";
import {
  ArrowLeftIcon,
  SpeakerWaveIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { ReactComponent as FormatSizeIcon } from "../assets/Format_size.svg";
import { DropDown } from "@/components";

function SettingsPage() {
  const mypagebarBackground = "z-10 bg-white drop-shadow";
  const navigate = useNavigate();
  const backClick = () => {
    navigate("/mypage");
  };

  // useState를 사용하여 현재 선택된 글자크기를 저장합니다.
  const [fontSize, setFontSize] = useState("medium");

  // 버튼 클릭 시 선택된 글자크기를 업데이트하는 함수입니다.
  const handleClick = (size: string) => {
    setFontSize(size);
  };

  // 드롭다운을 위한 설정
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectGender, setSelectGender] = useState<string>("여성(기본)");
  const gender = () => {
    return ["여성(기본)", "남성"];
  };

  // 드롭다운 on/off
  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  // 이게 뭘까?
  const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
    if (event.currentTarget === event.target) {
      setShowDropDown(false);
    }
  };

  // 성별선택
  const genderSelection = (gender: string): void => {
    setSelectGender(gender);
  };

  return (
    <div>
      <div
        className={`${mypagebarBackground} flex h-full w-full flex-row p-2.5`}
      >
        <div>
          <ArrowLeftIcon className="h-8 w-8" onClick={backClick} />
        </div>
        <div className="pl-[30%] text-3xl font-bold ">환경설정</div>
      </div>

      <div className="m-4 flex flex-row justify-start pt-4 text-center">
        <FormatSizeIcon className="h-8 w-8" />
        <div className="pl-4 text-2xl font-bold">글자 크기 설정</div>
      </div>
      {/* 선택된 글자크기에 따라 버튼 스타일을 동적으로 변경합니다. */}
      <div className="m-2 mx-3 flex flex-row justify-between pt-6">
        <button
          className={`mx-6 text-lg font-bold ${
            fontSize === "small" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => handleClick("small")}
        >
          작게
        </button>
        <button
          className={`mx-7 ml-9 text-xl font-bold ${
            fontSize === "medium" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => handleClick("medium")}
        >
          보통
        </button>
        <button
          className={`mx-6 text-2xl font-bold ${
            fontSize === "large" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => handleClick("large")}
        >
          크게
        </button>
      </div>

      <div className="relative m-4 mx-10 flex flex-row justify-between">
        <button
          className={`z-30 h-8 w-8 rounded-full border-2 border-gray-400 ${
            fontSize === "small" ? "bg-black" : "bg-white"
          }`}
          onClick={() => handleClick("small")}
        />
        <button
          className={`z-30 h-8 w-8 rounded-full border-2 border-gray-400 ${
            fontSize === "medium" ? "bg-black" : "bg-white"
          }`}
          onClick={() => handleClick("medium")}
        />
        <button
          className={`z-30 h-8 w-8 rounded-full border-2 border-gray-400 ${
            fontSize === "large" ? "bg-black" : "bg-white"
          }`}
          onClick={() => handleClick("large")}
        />

        <div className="absolute z-0 mt-3.5 h-0.5 w-full bg-gray-950" />
      </div>

      <div className="m-4 mt-8 flex flex-row pt-4">
        <SpeakerWaveIcon className="h-8 w-8" />
        <div className="pl-4 text-2xl font-bold">음성 설정</div>
      </div>

      {/* 드롭다운 */}
      <div className="m-8 pb-8 text-3xl font-semibold">
        <button
          className="text-3xl font-semibold"
          onClick={(): void => toggleDropDown()}
          onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
            dismissHandler(e)
          }
        >
          <div className="flex flex-row">
            <div className="flex-grow">{selectGender}</div>
            <div className="flex flex-row space-x-2">
              <ChevronDownIcon className="h-8 w-8 pt-2" />
            </div>
          </div>

          {/* 드롭다운 열릴 시 */}
          <div className="pr-8">
            {showDropDown && (
              <DropDown
                gender={gender()}
                showDropDown={false}
                toggleDropDown={(): void => toggleDropDown()}
                genderSelection={genderSelection}
              />
            )}
          </div>
        </button>

        <div className="z-0 mt-3.5 h-0.5 w-full bg-red-main" />
      </div>
    </div>
  );
}

export default SettingsPage;
