import React, { SetStateAction, useState } from "react";
import Button from "../common/ui/Button";
import { useNavigate } from "react-router-dom";
import { BookOpenIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import Modal from "../common/ui/Modal";

interface PropsType {
  isStarted?: boolean;
  cancel: () => void;
  setEndWithoutSaving: React.Dispatch<SetStateAction<boolean>>;
}

function RecordpageSideBar({
  isStarted,
  cancel,
  setEndWithoutSaving,
}: PropsType) {
  const navigate = useNavigate();
  const isLoggedin = !!localStorage.getItem("access_token");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [navigateTo, setNavigateTo] = useState<string>("");

  const handleConversationPageClick = () => {
    navigate("/comm");
  };

  const handleRecordPageClick = () => {
    if (isStarted) {
      setOpenModal(true);
      setNavigateTo("/records");
    } else {
      navigate("/records");
    }
  };

  // 로그인된 상태에서만 MyPage로 이동
  const handleMypageClick = () => {
    if (isStarted) {
      setOpenModal(true);
      setNavigateTo("/mypage/settings");
    } else {
      navigate("/mypage/settings");
    }
  };

  function handleExitClick() {
    setEndWithoutSaving(true);
    cancel();
    navigate(navigateTo);
  }

  return (
    <div
      className="fixed left-0 top-16 h-full w-[18%] min-w-fit border border-slate-200 bg-slate-50"
      style={{ height: "100%" }}
    >
      <div className="flex h-full flex-col text-xl font-semibold">
        <div className="w-full border-b border-slate-200">
          <div className="m-6 h-[10%] w-[80%] items-center">
            <button
              className=" group relative w-full overflow-hidden rounded-xl bg-gray-200 px-4 py-2 font-Pretendard-Regular shadow-md"
              disabled
            >
              <span className="relative text-gray-400">회의 시작하기</span>
            </button>
          </div>
        </div>
        <div
          onClick={handleRecordPageClick}
          className="flex h-[10%] w-full items-center border-b border-slate-200 hover:cursor-pointer hover:bg-blue-main hover:text-white"
        >
          <div className="m-6 flex flex-row">
            <div className="h-7 w-7 p-1">
              <BookOpenIcon />
            </div>
            <div className="pl-1">내 기록</div>
          </div>
        </div>
        <div
          onClick={handleMypageClick}
          className="flex h-[10%] w-full items-center border-b border-slate-200 hover:cursor-pointer hover:bg-blue-main hover:text-white"
        >
          <div className="m-6 flex flex-row">
            <div className="h-7 w-7 p-1">
              <Cog6ToothIcon />
            </div>
            <div className="pl-1">내 정보</div>
          </div>
        </div>
      </div>
      {openModal && (
        <Modal
          open={openModal}
          cannotExit={false}
          setOpenSidebarModal={setOpenModal}
        >
          <p className="text-base font-bold">
            대화 중에 페이지를 이동하시면 대화가 저장되지 않습니다. <br />
            이동하시겠습니까?
          </p>
          <div className="flex flex-row">
            <Button onClick={() => setOpenModal(false)} type="backButton">
              취소
            </Button>
            <Button onClick={handleExitClick} type="deleteButton">
              나가기
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default RecordpageSideBar;
