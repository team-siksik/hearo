import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, BookmarkIcon, Cog6ToothIcon, InformationCircleIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components";
import { DropDown }  from "@/components";


function Mypage() {
  const [user, setUser] = useState<number>(0);
  const mypagebarBackground = "z-10 bg-white drop-shadow";
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'logout' | 'delete'>('logout');
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

  const onLogoutButton = () => {
    setModalType('logout');
    setShowModal(true);
    
  }

  const onDeleteButtonClick = (id: any) => {
    setModalType('delete');
    setUser(id);
    setShowModal(true);
    console.log('계정삭제')
  }

  const ModalOff = () => {
    setShowModal(false);
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
        <button onClick={onLogoutButton} className="p-8 text-2xl font-bold text-red-main opacity-80">
          로그아웃
        </button>
        <button onClick={onDeleteButtonClick} className="p-8 text-2xl font-bold text-black opacity-50">
          회원탈퇴
        </button>
      </div>

      {/* 로그아웃, 회원탈퇴 모달  */}
      {showModal && (
        <Modal open={true} cannotExit={false}>
          {modalType === 'logout' && (
            <div>
              <div className="mb-2 text-xl fon t-semibold">정말 로그아웃하시겠습니까?</div>
              <div className="flex flex-row text-2xl justify-center m-1 mt-4 font-bold">
                <button onClick={ModalOff} className=" bg-red-1 hover:bg-red-main text-white w-28 mt-2 mx-2 pl-4 px-4 border-gray-950 rounded-full">
                  아니오 
                </button>
                <button className="mt-2 text-gray-950 border border-black rounded-full mx-2 w-28 py-2 px-4">
                  네
                </button>
              </div>
          </div>
          )}

          {modalType === 'delete' && (
            <div>
              <div className="mb-2 text-xl font-semibold text-red-main ">회원탈퇴</div>
              <div>정말 회원탈퇴를 하시겠어요?</div>
              <div>회원탈퇴를 하면 목록에 있는 내용이</div>
              <div className="pb-4">전부 삭제됩니다!</div>
              <div className="pb-16">그래도 정말 하시겠습니까?</div>
              <div className="flex flex-row text-2xl justify-center m-1 font-bold">
                <button onClick={ModalOff} className=" bg-red-1 hover:bg-red-main text-white w-28 mx-2 mt-2 pl-4 px-4 border-gray-950 rounded-full">
                  아니오 
                </button>
                <button className="mt-2 text-gray-950 border border-black rounded-full mx-2 w-28 py-2 px-4">
                  네
                </button>
              </div>
          </div>
          )}
        </Modal>
      )}

    </div>
  )
}

export default Mypage;
