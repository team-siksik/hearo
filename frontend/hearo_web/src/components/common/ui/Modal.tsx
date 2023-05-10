import React, { SetStateAction, useState } from "react";
import ReactModal from "react-modal";
import { ReactComponent as CrossIconRed } from "@/assets/Icon/CrossIconRed.svg";

/**
 * 알림에 사용되는 모달 컴포넌트
 * @open : 상단에서 열고 닫음에 따라 보여줄 수 있도록 open 을 불리언으로 전달해주어야 합니다.
 * @type? : 혹시 모달 컴포넌트를 사용하는데 디자인이나 기능이 다르다면 type을 보내주어서 아래에서 type에 따라 다른 컴포넌트를 return 해주게 합니다.
 * @children : children은 상단에서 전달받는 내용으로 <Modal>내부에 들어있는 내용</Modal> 입니다. 화면에 표현될 내용입니다.
 */
interface PropsType {
  open: boolean;
  cannotExit: boolean;
  type?: string;
  children: React.ReactNode;
  setLoginModal?: React.Dispatch<SetStateAction<boolean>>;
  setOpenInfoModal?: React.Dispatch<SetStateAction<boolean>>;
  setOpenGPTModal?: React.Dispatch<SetStateAction<boolean>>;
  setOpenAddFavModal?: React.Dispatch<SetStateAction<boolean>>;
  setOpenExitModal?: React.Dispatch<SetStateAction<boolean>>;
}

const customModalStyles: ReactModal.Styles = {
  overlay: {
    // 검은색으로 칠해지는 모달 아래부분
    backgroundColor: " rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100vh",
    zIndex: "100",
    position: "absolute",
    top: "0",
    left: "0",
    boxShadow: "0 8 10",
  },
  content: {
    // 모달 박스의 스타일
    width: "30%",
    height: "fit-content",
    padding: "32px",
    zIndex: "150",
    position: "absolute",
    textAlign: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "20px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    backgroundColor: "white",
    justifyContent: "center",
    overflow: "auto",
  },
};

function Modal({
  open,
  type,
  cannotExit,
  children,
  setLoginModal,
  setOpenInfoModal,
  setOpenGPTModal,
  setOpenAddFavModal,
  setOpenExitModal,
}: PropsType) {
  const [openModal, setOpenModal] = useState<boolean>(open);

  // x버튼이나, 나가기 혹은 취소 버튼을 누르면 modal을 닫게 하기 위한 함수입니다.
  function handleModal() {
    setOpenModal(!openModal);
    if (setLoginModal) {
      setLoginModal(false);
    }
    if (setOpenInfoModal) {
      setOpenInfoModal(false);
    }
    if (setOpenGPTModal) {
      setOpenGPTModal(false);
    }
    if (setOpenAddFavModal) {
      setOpenAddFavModal(false);
    }
    if (setOpenExitModal) {
      setOpenExitModal(false);
    }
  }
  return (
    <ReactModal
      isOpen={openModal}
      style={customModalStyles} // 개별 스타일링을 줄 수 있습니다.
      onRequestClose={() => {
        setOpenModal(false);
        if (setLoginModal) {
          setLoginModal(false);
        }
        if (setOpenInfoModal) {
          setOpenInfoModal(false);
        }
        if (setOpenGPTModal) {
          setOpenGPTModal(false);
        }
        if (setOpenAddFavModal) {
          setOpenAddFavModal(false);
        }
        if (setOpenExitModal) {
          setOpenExitModal(false);
        }
      }}
      shouldCloseOnOverlayClick={cannotExit ? false : true}
      ariaHideApp={false}
    >
      <div className="absolute right-2 top-1 flex">
        {cannotExit ? null : (
          <button onClick={handleModal}>
            <CrossIconRed />
          </button>
        )}
      </div>
      {children}
    </ReactModal>
  );
}

export default Modal;
