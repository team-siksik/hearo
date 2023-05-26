import React, { useState, SetStateAction } from "react";
import { Button, Modal } from "@/components";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/redux/hooks";
import { RecordAPI } from "@/apis/api";
import { deleteRecords } from "@/redux/modules/records";

interface PropsType {
  setOpenRemoveRecordModal: React.Dispatch<SetStateAction<boolean>>;
  recordSeq: number;
  type?: string;
}

function RemoveRecordModal({
  setOpenRemoveRecordModal,
  recordSeq,
  type,
}: PropsType) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenRemoveRecordModal((prev) => !prev);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteRecords([recordSeq]));
    if (type === "inRecordItem") {
      //FIXME: 뒤로가기 하게 되면 지운 record 파일이 뷰에서 남아있음 / selector로도 업데이트 되지 않음
      navigate(-1);
    }
    setOpenRemoveRecordModal(false);
  };

  return (
    <Modal
      open={true}
      cannotExit={false}
      setOpenRemoveRecordModal={setOpenRemoveRecordModal}
    >
      <div>
        <h1 className="m-2 text-xl font-bold">삭제</h1>
        <p className="m-4 pb-4">대화기록을 삭제하시겠습니까?</p>
      </div>
      <div className="grid w-full grid-flow-col grid-cols-2 justify-center gap-2 px-4 ">
        <div className="flex w-full">
          <button
            className="group relative m-4 w-full overflow-hidden rounded-xl border 
          border-blue-main bg-white px-4 py-2 text-blue-main
          shadow-md transition-all duration-[250ms] ease-out hover:bg-blue-50"
            onClick={(e) => handleCloseModal(e)}
          >
            <div className="absolute inset-0 w-3  "></div>
            <span className="relative">취소</span>
          </button>
        </div>
        <div className="flex w-full">
          <button
            className="group relative m-4 w-full overflow-hidden rounded-xl border border-red-main bg-red-500 px-4 py-2
        text-white shadow-md transition-all duration-[250ms] ease-out hover:bg-red-main"
            onClick={(e) => handleRemove(e)}
          >
            <div className="absolute inset-0 w-3  "></div>
            <span className="relative">삭제</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default RemoveRecordModal;
