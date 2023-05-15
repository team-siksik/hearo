import React, { SetStateAction } from "react";
import Modal from "./Modal";

/**
 * 상단에 위에서 아래로 내려오는 alert입니다.
 * 연결 오류나 기타 에러는 해당 alert로 통일하겠습니다.
 */

interface PropsType {
  setOpenAlertModal: React.Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}
function Alert({ setOpenAlertModal, children }: PropsType) {
  return (
    <Modal open={true} cannotExit={false} setOpenAlertModal={setOpenAlertModal}>
      {children}
    </Modal>
  );
}

export default Alert;
