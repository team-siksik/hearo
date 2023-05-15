import React, { useState } from "react";
import {
  ArrowLeftIcon,
  SpeakerWaveIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { ReactComponent as FormatSizeIcon } from "../assets/Format_size.svg";
import HearoLogo from "@/assets/HearoLogo.svg";
import {
  Button,
  Modal,
  DropDown,
  MypageSideBar,
  ConvertBar,
} from "@/components";
import {
  googleLogout,
  googleWithdraw,
  userActions,
} from "@/redux/modules/user";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";

function SettingsPage() {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"logout" | "delete">("logout");
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

  const [selectFontSize, setSelectFontSize] = useState<string>("보통");
  const fontsize = () => {
    return ["작게", "보통", "크게"];
  };

  // 드롭다운 on/off
  const gendertoggledown = () => {
    setShowDropDown(!showDropDown);
  };

  const fontsizetoggledown = () => {
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

  // 폰트크기선택
  const fontSizeSelection = (fontsize: string): void => {
    setSelectFontSize(fontsize);
  };

  const onLogoutButton = () => {
    setModalType("logout");
    setShowModal(true);
  };

  // const onDeleteButtonClick = (id: any) => {
  //   setModalType("delete");
  //   setUser(id);
  //   setShowModal(true);
  // };

  const onDeleteButtonClick = () => {
    setModalType("delete");
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
      <MypageSideBar />
      <div className="fixed right-0 mt-16 h-full w-[82%]">
        <ConvertBar />
        <div className="right-0 mx-10 mb-4 mt-28 h-[70%] rounded-2xl p-4 shadow-md shadow-gray-200">
          <div className="flex flex-row">
            <div className="h-100 w-[50%] border-r-2">
              <img className="h-20 w-20" src={HearoLogo} />
              <div>account name</div>
            </div>

            <div className="h-full w-[50%]">
              <div className="mx-4 flex h-60 flex-row items-center justify-center">
                <div className="flex flex-col">
                  <div className="mt-2 flex flex-row items-stretch p-2.5">
                    <SpeakerWaveIcon className="h-6 w-6 self-center" />
                    <div className="self-center pl-4 text-xl font-light">
                      음성 설정
                    </div>
                  </div>

                  {/* 드롭다운 */}
                  <div className="m-4 font-light">
                    <button
                      className="w-40 text-2xl"
                      onClick={(): void => gendertoggledown()}
                      onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
                        dismissHandler(e)
                      }
                    >
                      <div className="flex flex-row">
                        <div className="flex-grow">{selectGender}</div>
                        <div className="flex flex-row space-x-2">
                          <ChevronDownIcon className="pt- h-8 w-8" />
                        </div>
                      </div>

                      {/* 드롭다운 열릴 시 */}
                      <div className="pr-8 text-xl">
                        {/* {showDropDown && (
                          // FIXME: 드롭다운 typescript 오류 수정해야함
                          <DropDown
                            gender={gender()}
                            showDropDown={false}
                            toggleDropDown={(): void => gendertoggledown()}
                            genderSelection={genderSelection}
                          />
                        )} */}
                      </div>
                    </button>
                    <div className="z-0 mt-1 h-0.5 w-[100%] bg-gray-300" />
                  </div>
                </div>

                {/* 글자크기설정 */}
                <div className="flex flex-col">
                  <div className="mt-2 flex flex-row items-stretch p-2.5">
                    <SpeakerWaveIcon className="h-6 w-6 self-center" />
                    <div className="self-center pl-4 text-xl font-light">
                      글자 크기 설정
                    </div>
                  </div>

                  {/* 드롭다운 */}
                  <div className="m-4 font-light">
                    <button
                      className="w-40 text-2xl"
                      onClick={(): void => fontsizetoggledown()}
                      onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
                        dismissHandler(e)
                      }
                    >
                      <div className="flex flex-row">
                        <div className="flex-grow">{selectFontSize}</div>
                        <div className="flex flex-row space-x-2">
                          <ChevronDownIcon className="pt- h-8 w-8" />
                        </div>
                      </div>

                      {/* 드롭다운 열릴 시 */}
                      <div className="pr-8 text-xl">
                        {/* {showDropDown && (
                        <DropDown
                          fontsize={fontsize()}
                          showDropDown={false}
                          toggleDropDown={(): void => fontsizetoggledown()}
                          fontSizeSelection={fontSizeSelection} 
                        />
                      )} */}
                      </div>
                    </button>
                    <div className="z-0 mt-1 h-0.5 w-[100%] bg-gray-300" />
                  </div>
                </div>
              </div>

              {/* 환경설정 - 로그아웃, 회원탈퇴 버튼 */}
              <div className="h-30 flex items-center justify-center">
                <div className="flex w-40 flex-col">
                  <Button onClick={onLogoutButton} type="accountLogoutButton">
                    로그아웃
                  </Button>
                  <Button
                    onClick={onDeleteButtonClick}
                    type="accountDeleteButton"
                  >
                    회원탈퇴
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 로그아웃, 회원탈퇴 모달  */}
      {showModal && (
        <Modal open={true} cannotExit={false}>
          {modalType === "logout" && (
            <div>
              <div className="mb-1 text-xl font-semibold">
                정말 로그아웃하시겠습니까?
              </div>
              <div className="m-1 mt-4 flex flex-row justify-center text-2xl font-bold">
                <Button onClick={ModalOff} type="deleteButton">
                  아니오
                </Button>
                <Button onClick={handleLogoutClick} type="backButton">
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
              <div className="pb-4">그래도 정말 하시겠습니까?</div>
              <div className="m-1 flex flex-row justify-center text-2xl font-bold">
                <Button onClick={ModalOff} type="deleteButton">
                  {" "}
                  아니오
                </Button>
                <Button onClick={deleteAccount} type="backButton">
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

export default SettingsPage;

// 삭제한 부분
{
  /* <div className="m-4 flex flex-row justify-center pt-4 text-center">
        <FormatSizeIcon className="h-8 w-8" />
        <div className="pl-4 text-2xl font-bold">글자 크기 설정</div>
      </div> */
}

{
  /* <div className="m-2 mx-3 flex flex-row justify-between pt-6">
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
      </div> */
}

{
  /* <div className="relative m-4 mx-10 flex flex-row justify-between">
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

      </div> */
}
