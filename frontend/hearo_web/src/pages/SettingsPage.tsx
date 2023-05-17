import React, { useState, SetStateAction } from "react";
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

interface PropsType {
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
}

// 마이페이지 - 환경설정
function SettingsPage({setShowModal}:PropsType) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<"logout" | "delete">("logout");
  const loginedUser = useAppSelector((state) => state.user.user);
  const [openModal, setOpenModal] = useState<boolean>(false);

  // 드롭다운을 위한 설정
  const [showGenDropDown, setShowGenDropDown] = useState<boolean>(false);
  const [selectGender, setSelectGender] = useState<string>("여성(기본)");
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
    setShowModal(true);
  };

  const onDeleteButtonClick = () => {
    setOpenModal(true);
    setModalType("delete");
    setShowModal(true);
  };

  const ModalOff = () => {
    setOpenModal(false);
    setShowModal(false);
  };

  function handleLogoutClick(){
    dispatch(googleLogout(localStorage.getItem("accessToken")!));
    dispatch(userActions.logoutAction());
    alert('정상적으로 로그아웃되었습니다. 메인페이지로 이동합니다');
    navigate("/");
  };

  function deleteAccount() {
    dispatch(googleWithdraw(localStorage.getItem("accessToken")!));
    
  }

  // FIXME: 모달 밖을 눌러서 모달을 닫았을 때, 재클릭 시 모달이 더이상 뜨지 않는 현상 
  return (
    <div>
      <MypageSideBar/>
      <div className="fixed right-0 mt-16 w-[82%] h-full"> 
        <ConvertBar/>
        <div className="fixed w-[76%] right-0 mx-10 mb-4 mt-28 h-[70%] shadow-gray-200 rounded-b-2xl shadow-md">
          <div className="flex flex-row justify-center">
            <div className="w-[50%] h-100 border-r-2 grid grid-rows-1">
              <div className="flex flex-col items-center my-20">
                  <div className="h-34 w-34 rounded border-blue-main">
                  <div
                    className="h-32 w-32 rounded border-blue-main"
                  // css={css`
                  //   background-image: url(${loginedUser?.profileImg});
                  //   background-image: url(${loginedUser?.profileImg});
                  //   background-position: center;
                  //   background-size: cover;
                  // `}
                  >
                    <UserCircleIcon />
                  </div>
                </div>
              <div className="flex flex-col text-center p-4">
                <div className="text-3xl text-blue-main">{loginedUser?.nickname}김야옹<span className="text-black">님</span></div>
                <div className="text-3xl">반갑습니다</div>
                <div className="text-xl pt-4">설정 변경을 통해 <span className="text-blue-main">히어로</span>
                  를
                  <p></p> 
                  더 편리하게 이용해보세요!</div>
              </div>
          </div>
        </div>

          {/* 오른쪽페이지 */}
          <div className="w-[50%] h-full">  
            <div className="h-72 mt-10 mx-4 flex flex-row justify-center">
              <div className="flex flex-col">
                <div className="flex flex-row justify-center p-4 items-stretch">
                  <SpeakerWaveIcon className="h-6 w-6 self-center"/>
                  <div className="pl-4 text-2xl font-medium self-center">음성 설정</div>
                </div>

              {/* 드롭다운 */}
              <div className="m-4 font-light h-full">
                <button
                  className="text-2xl w-40"
                  onClick={(): void => gendertoggledown()}
                  onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
                    dismissHandler(e)
                  }
                  >
                  <div className="flex flex-row">
                    <div className="flex-grow">{selectGender}</div>
                      <div className="flex flex-row space-x-2">
                        <ChevronDownIcon className="h-8 w-8" />
                      </div>
                    </div>
                  
                    {/* 드롭다운 열릴 시 */}
                    <div className="pr-8 text-xl">
                      {showGenDropDown && (
                        // FIXME: 드롭다운 typescript 오류 수정해야함
                        <DropDown
                          gender={gender()}
                          showGenDropDown={false}
                          toggleDropDown={(): void => gendertoggledown()}
                          genderSelection={genderSelection} 
                          />
                        )}
                      </div>
                    </button>
                    <div className="z-0 mt-1 h-0.5 w-[100%] bg-gray-300"/>
                  </div>
                </div>
              </div>

              {/* 환경설정 - 로그아웃, 회원탈퇴 버튼 */}
              <div className="h-20 flex items-center justify-center">
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
      {openModal && 
        <Modal open={true} cannotExit={false}>
          {(modalType === "logout") ? (
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
          ) :
          ( <div>
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
        }
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
