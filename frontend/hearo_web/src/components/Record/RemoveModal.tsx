import React, { useState, SetStateAction } from "react";
import { Button, Modal } from "@/components";
import { useNavigate } from "react-router-dom";

interface PropsType {
  setOpenRemoveModal: React.Dispatch<SetStateAction<boolean>>;
}

function RemoveRecordModal({ setOpenRemoveModal }: PropsType) {
  const [openRemoveRecordModal, setOpenRemoveRecordModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleRemoveClick = () => {
    setOpenRemoveModal((prev) => !prev);
    setOpenRemoveRecordModal(false);
  }

  const ModalOff = () => {
    setOpenRemoveRecordModal(false);
  }

  return (
    <Modal open={true} cannotExit={false}>
      <div>
        <h1 className="m-2 text-xl font-bold">삭제</h1>
        <p className="m-2">
          대화를 저장하고
          <br />
          종료하시겠습니까?
        </p>
      </div>
      <div className=" grid w-full grid-flow-col grid-cols-2 justify-center gap-2 px-4 ">
        <div className="flex w-full">
          <Button onClick={ModalOff} type="redTextBtn">
            취소
          </Button>
        </div>
        <div className="flex w-full">
          <Button onClick={handleRemoveClick} type="redBgBtn">
            삭제
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default RemoveRecordModal;