import React, { SetStateAction } from "react";
import Modal from "../common/ui/Modal";
import { GOOGLE_AUTH_URL } from "@/apis/oAuthGoogle";
import google_logo from "@/assets/Google_Logo.svg";
import Button from "../common/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { googleLogout, userActions } from "@/redux/modules/user";

interface PropsType {
  setOpenProfileModal: React.Dispatch<SetStateAction<boolean>>;
}


function profileModal({ setOpenProfileModal }: PropsType) {
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();
  const gocommbutton = () => {
    setOpenProfileModal(false);
    navigate("/comm")
  }
  const gorecognizebutton = () => {
    setOpenProfileModal(false);
    navigate("/records")
  }
  const gomypagebutton = () => {
    setOpenProfileModal(false);
    navigate("/mypage")
  }
  
  const dispatch = useAppDispatch();
  const handleLogoutClick = () => {
    dispatch(googleLogout(localStorage.getItem("accessToken")!));
    dispatch(userActions.logoutAction());
    alert('정상적으로 로그아웃되었습니다. 메인페이지로 이동합니다')
    setOpenProfileModal(false);
    navigate("/");
  };

  return (
    <Modal type="profileModal" open={true} cannotExit={false} setOpenProfileModal={setOpenProfileModal}>
      <div className="text-2xl font-bold text-start pl-1 pb-2">{user?.nickname}님</div>
      <div className="flex flex-col font-semibold">
        <Button onClick={gocommbutton} type="accountModalButton">회의 시작하기</Button>
        <Button onClick={gorecognizebutton} type="accountModalButton">나의 회의록</Button>
        <Button onClick={gomypagebutton} type="accountModalButton">설정</Button>
        <div className="text-red-400 font-semibold flex justify-end mt-3 transition-all">
        <Button onClick={handleLogoutClick}>
          <div className="hover:text-red-main" >로그아웃</div></Button>
        </div>
      </div>
    </Modal>
  );
}

export default profileModal;
