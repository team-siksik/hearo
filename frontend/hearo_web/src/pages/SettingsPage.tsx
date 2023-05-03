import React, { useState } from "react";
import { ArrowLeftIcon, SpeakerWaveIcon, ChevronDownIcon} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { ReactComponent as FormatSizeIcon } from '../assets/Format_size.svg'
import { DropDown }  from "@/components";


function SettingsPage() {
  const mypagebarBackground = "z-10 bg-white drop-shadow";
  const navigate = useNavigate();

  // useState를 사용하여 현재 선택된 글자크기를 저장합니다.
  const [fontSize, setFontSize] = useState('medium');

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
    <div className={`${mypagebarBackground} flex flex-row p-2.5 w-full h-full`}>
      <div>
        <ArrowLeftIcon className="w-8 h-8" onClick={() => navigate(-1)} />
      </div>
      <div className="pl-[30%] font-bold text-3xl ">
        환경설정
      </div>
    </div>

    <div className="m-4 pt-4 flex flex-row text-center justify-start">
      <FormatSizeIcon className="w-8 h-8"/>
      <div className="pl-4 font-bold text-2xl">
        글자 크기 설정
      </div>
    </div>  
      {/* 선택된 글자크기에 따라 버튼 스타일을 동적으로 변경합니다. */}
      <div className="m-2 mx-3 pt-6 flex flex-row justify-between">
        <button className={`mx-6 text-lg font-bold ${fontSize === 'small' ? 'text-blue-500' : 'text-gray-500'}`} onClick={() => handleClick('small')}>
          작게
        </button>
        <button className={`mx-7 ml-9 text-xl font-bold ${fontSize === 'medium' ? 'text-blue-500' : 'text-gray-500'}`} onClick={() => handleClick('medium')}>
          보통
        </button>
        <button className={`mx-6 text-2xl font-bold ${fontSize === 'large' ? 'text-blue-500' : 'text-gray-500'}`} onClick={() => handleClick('large')}>
          크게
        </button>
      </div>

      <div className="m-4 mx-10 flex flex-row justify-between relative">
        <button className={`z-30 w-8 h-8 rounded-full border-2 border-gray-400 ${
          fontSize === "small" ? "bg-black" : "bg-white"}`}
          onClick={() => handleClick("small")}/>
        <button className={`z-30 w-8 h-8 rounded-full border-2 border-gray-400 ${
          fontSize === "medium" ? "bg-black" : "bg-white"}`}
          onClick={() => handleClick("medium")}/>
        <button className={`z-30 w-8 h-8 rounded-full border-2 border-gray-400 ${
          fontSize === "large" ? "bg-black" : "bg-white"}`}
          onClick={() => handleClick("large")}/>
      
      <div className="absolute mt-3.5 w-full h-0.5 bg-gray-950 z-0"/>
    </div>

    <div className="m-4 mt-8 pt-4 flex flex-row">
      <SpeakerWaveIcon className="w-8 h-8"/>
      <div className="pl-4 font-bold text-2xl">
        음성 설정
      </div>
    </div>

    {/* 드롭다운 */}
    <div className="m-8 font-semibold text-3xl pb-8">
      <button
        className="font-semibold text-3xl"
        onClick={(): void => toggleDropDown()}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
          dismissHandler(e)}>

      <div className="flex flex-row">
        <div className="flex-grow">{selectGender}</div>
        <div className="flex flex-row space-x-2">
          <ChevronDownIcon className="h-8 w-8 pt-2"/>
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


      <div className="mt-3.5 w-full h-0.5 bg-red-main z-0"/>
    </div>

  </div>
  )
}

export default SettingsPage;