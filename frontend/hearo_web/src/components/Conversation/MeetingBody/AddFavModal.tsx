import Button from "@/components/common/ui/Button";
import Modal from "@/components/common/ui/Modal";
import React, { SetStateAction } from "react";

interface PropsType {
  setOpenAddFavModal: React.Dispatch<SetStateAction<boolean>>;
}

export default function AddFavModal({ setOpenAddFavModal }: PropsType) {
  return (
    <Modal
      open={true}
      cannotExit={false}
      setOpenAddFavModal={setOpenAddFavModal}
    >
      <h3>자주 쓰는 말 추가</h3>
      <p>자주 사용하시는 말로 추가하시겠습니까?</p>
      <div>
        <Button onClick={() => setOpenAddFavModal(false)} type="blueTextBtn">
          아니오
        </Button>
        <Button onClick={() => console.log("yes!")} type="blueTextBtn">
          추가하기
        </Button>
      </div>
    </Modal>
  );
}
