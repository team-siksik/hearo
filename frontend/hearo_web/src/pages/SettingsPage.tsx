import React, { useState, SetStateAction, useEffect } from "react";
import {
  SpeakerWaveIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
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
import { getUserSetting } from "@/redux/modules/profile";

// 마이페이지 - 환경설정
function SettingsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<"logout" | "delete">("logout");
  const loginedUser = useAppSelector((state) => state.user.user);
  const settings = useAppSelector((state) => state.profile.setting);

  useEffect(() => {
    dispatch(getUserSetting());
  }, []);

  const [openModal, setOpenModal] = useState<boolean>(false);

  // 드롭다운을 위한 설정
  const [showGenDropDown, setShowGenDropDown] = useState<boolean>(false);
  const [selectGender, setSelectGender] = useState<string>("");

  const gender = () => {
    return ["여성(기본)", "남성"];
  };

  // 드롭다운 on/off
  const gendertoggledown = () => {
    setShowGenDropDown(!showGenDropDown);
  };

  const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
    if (event.currentTarget === event.target) {
      setShowGenDropDown(false);
    }
  };

  // 성별선택
  const genderSelection = (gender: string): void => {
    setSelectGender(gender);
  };

  const onLogoutButton = () => {
    setOpenModal(true);
    setModalType("logout");
  };

  const onDeleteButtonClick = () => {
    setOpenModal(true);
    setModalType("delete");
  };

  const ModalOff = () => {
    setOpenModal(false);
  };

  function handleLogoutClick() {
    dispatch(googleLogout(localStorage.getItem("accessToken")!));
    dispatch(userActions.logoutAction());
    alert("정상적으로 로그아웃되었습니다. 메인페이지로 이동합니다");
    navigate("/");
  }

  function deleteAccount() {
    dispatch(googleWithdraw(localStorage.getItem("accessToken")!));
  }

  // FIXME: 모달 밖을 눌러서 모달을 닫았을 때, 재클릭 시 모달이 더이상 뜨지 않는 현상
  return (
    <div>
      <MypageSideBar />
      <div className="fixed right-0 mt-16 h-full w-[82%]">
        <ConvertBar />
        <div className="fixed right-0 mx-10 mb-4 mt-28 h-[70%] w-[76%] rounded-b-2xl shadow-md shadow-gray-200">
          <div className="flex flex-row justify-center">
            <div className="h-100 grid w-[50%] grid-rows-1 border-r-2">
              <div className="my-20 flex flex-col items-center">
                <div className="h-34 w-34 rounded border-blue-main">
                  <div
                    className="h-32 w-32 rounded border-blue-main"
                    // css={css//   background-image: url(${loginedUser?.profileImg});
                    //   background-image: url(${loginedUser?.profileImg});
                    //   background-position: center;
                    //   background-size: cover;
                    //}
                  >
                    <UserCircleIcon />
                  </div>
                </div>
                <div className="flex flex-col p-4 text-center">
                  <div className="text-3xl text-blue-main">
                    {loginedUser?.nickname}
                    <span className="text-black">님</span>
                  </div>
                  <div className="text-3xl">반갑습니다</div>
                  <div className="pt-4 text-xl">
                    설정 변경을 통해
                    <span className="text-blue-main">히어로</span>를<p></p>더
                    편리하게 이용해보세요!
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* 오른쪽페이지 */}
            <div className="h-full w-[50%]">
              <div className="mx-4 mt-10 flex h-72 flex-row justify-center">
                <div className="flex flex-col">
                  <div className="flex flex-row items-stretch justify-center p-4">
                    <SpeakerWaveIcon className="h-6 w-6 self-center" />
                    <div className="self-center pl-4 text-2xl font-medium">
                      음성 설정
                    </div>
                  </div>

                  {/* 드롭다운 */}
                  <div className="m-4 h-full font-light">
                    <button
                      className="w-40 text-2xl"
                      onClick={(): void => gendertoggledown()}
                      onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
                        dismissHandler(e)
                      }
                    >
                      <div className="flex flex-row">
                        <div className="flex-grow">
                          {settings?.voiceSetting === 1 ? "여성[기본]" : "남성"}
                        </div>
                        <div className="flex flex-row space-x-2">
                          <ChevronDownIcon className="h-8 w-8" />
                        </div>
                      </div>

                      {/* 드롭다운 열릴 시 */}
                      <div className="pr-8 text-xl">
                        {showGenDropDown && (
                          <DropDown
                            gender={gender()}
                            showGenDropDown={false}
                            toggleDropDown={(): void => gendertoggledown()}
                            genderSelection={genderSelection}
                          />
                        )}
                      </div>
                    </button>
                    <div className="z-0 mt-1 h-0.5 w-[100%] bg-gray-300" />
                  </div>
                </div>
              </div>

              {/* 환경설정 - 로그아웃, 회원탈퇴 버튼 */}
              <div className="flex h-20 items-center justify-center">
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
      {openModal && (
        <Modal open={true} cannotExit={false} setOpenMyPageModal={setOpenModal}>
          {modalType === "logout" ? (
            <div>
              <div className="mb-1 text-xl font-semibold">
                로그아웃하시겠습니까?
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
          ) : (
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
