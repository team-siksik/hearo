import React, { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Button, Modal, MypageSideBar, DropDown } from "@/components";
import { useAppDispatch } from "@/redux/hooks";
import {
  googleLogout,
  googleWithdraw,
  userActions,
} from "@/redux/modules/user";

function Mypage() {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<number>(0);
  const mypagebarBackground = "z-10 bg-white drop-shadow";
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"logout" | "delete">("logout");
  const navigate = useNavigate();

  const FavClick = () => {
    navigate("/mypage/favcontents");
  };

  const SettingClick = () => {
    navigate("/mypage/settings");
  };

  const AgainClick = () => {
    navigate("/again");
  };

  const onLogoutButton = () => {
    setModalType("logout");
    setShowModal(true);
  };

  const onDeleteButtonClick = (id: any) => {
    setModalType("delete");
    setUser(id);
    setShowModal(true);
  };

  const ModalOff = () => {
    setShowModal(false);
  };

  const handleLogoutClick = () => {
    dispatch(googleLogout(localStorage.getItem("accessToken")!));
    dispatch(userActions.logoutAction());
  };

  function deleteAccount() {
    dispatch(googleWithdraw(localStorage.getItem("accessToken")!));
  }

  return (
    <div>
      <MypageSideBar/>
      <div className="absolute mt-16 right-0 w-[82%]">
        <div className="m-4 flex flex-col justify-center pt-4 text-center">
          <div className="pt-1 text-3xl font-bold">김야옹 님</div>
          <div className="text-1.5xl pt-1 font-light">cutekitty@gmail.com</div>
        </div>
        <hr className="m-4 h-0.5 bg-black opacity-10" />
        <div onClick={FavClick} className="flex flex-row justify-between p-3">
          <div className="flex flex-row pl-4 pr-4 text-2xl font-bold hover:cursor-pointer">
            <BookmarkIcon className="m-1 mr-2 h-6 w-6" />
            자주쓰는 말
          </div>
          <ChevronRightIcon className="m-1 h-6 w-6" />
        </div>
        <hr className="m-4 h-0.5 bg-black opacity-20" />
        <div onClick={SettingClick} className="flex flex-row justify-between p-3">
          <div className="flex flex-row pl-4 pr-4 text-2xl font-bold hover:cursor-pointer">
            <Cog6ToothIcon className="m-1 mr-2 h-6 w-6" />
            환경설정
          </div>
          <ChevronRightIcon className="m-1 h-6 w-6" />
        </div>
        <hr className="m-4 h-0.5 bg-black opacity-10" />
        <div onClick={AgainClick} className="flex flex-row justify-between p-3">
          <div className="flex flex-row pl-4 pr-4 text-2xl font-bold hover:cursor-pointer">
            <InformationCircleIcon className="m-1 mr-2 h-6 w-6" />
            튜토리얼 다시보기
          </div>
          <ChevronRightIcon className="m-1 h-6 w-6" />
        </div>
        <hr className="m-4 h-0.5 bg-black opacity-20" />

        <div className="m-8 flex flex-row justify-center">
          <button
            onClick={onLogoutButton}
            className="p-8 text-2xl font-bold text-red-main opacity-80"
          >
            로그아웃
          </button>
          <button
            onClick={onDeleteButtonClick}
            className="p-8 text-2xl font-bold text-black opacity-50"
            >
            회원탈퇴
          </button>
        </div>
      </div>

      {/* 로그아웃, 회원탈퇴 모달  */}
      {showModal && (
        <Modal open={true} cannotExit={false}>
          {modalType === "logout" && (
            <div>
              <div className="fon t-semibold mb-2 text-xl">
                정말 로그아웃하시겠습니까?
              </div>
              <div className="m-1 mt-4 flex flex-row justify-center text-2xl font-bold">
                <Button
                  onClick={ModalOff}
                  type="deleteButton"
                >
                  아니오
                </Button>
                <Button
                  onClick={handleLogoutClick}
                  type="backButton"
                >
                  네
                </Button>
              </div>
            </div>
          )}

          {modalType === "delete" && (
            <div>
              <div className="mb-2 text-xl font-semibold text-red-main ">
                회원탈퇴
              </div>
              <div>정말 회원탈퇴를 하시겠어요?</div>
              <div>회원탈퇴를 하면 목록에 있는 내용이</div>
              <div className="pb-4">전부 삭제됩니다!</div>
              <div className="pb-16">그래도 정말 하시겠습니까?</div>
              <div className="m-1 flex flex-row justify-center text-2xl font-bold">
                <Button
                  onClick={ModalOff}
                  type="deleteButton"
                  > 아니오
                </Button>
                <Button
                  onClick={deleteAccount}
                  type="backButton"
                >
                  네
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default Mypage;
