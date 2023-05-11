import React, { useState, SetStateAction } from "react";
import { Button, Modal } from "@/components";
import { useNavigate } from "react-router-dom";

interface PropsType {
  setOpenRemoveRecordModal: React.Dispatch<SetStateAction<boolean>>;
  handleRemoveClick: () => void;
}



function RemoveRecordModal({ setOpenRemoveRecordModal, handleRemoveClick }: PropsType) {

  const handleCloseModal = () => {
    setOpenRemoveRecordModal(false);
    };

  const handleRemove = () => {
    handleRemoveClick();
    setOpenRemoveRecordModal(false);
    };

  return (
    <Modal open={true} cannotExit={false}>
      <div>
        <h1 className="m-2 text-xl font-bold">삭제</h1>
        <p className="m-4 pb-4">
          대화를 삭제하시겠습니까?
        </p>
      </div>
      <div className="grid w-full grid-flow-col grid-cols-2 justify-center gap-2 px-4 ">
        <div className="flex w-full">
          <Button onClick={handleCloseModal} 
          type="backButton"
          >
            취소
          </Button>
        </div>
        <div className="flex w-full">
          <Button 
          onClick={handleRemove}
          type="deleteButton"
          >
            삭제
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default RemoveRecordModal;