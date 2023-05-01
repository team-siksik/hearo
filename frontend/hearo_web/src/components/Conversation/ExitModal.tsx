import React, { SetStateAction } from "react";
import { Button, Modal } from "@/components";
import { useNavigate } from "react-router-dom";

interface PropsType {
  stream?: MediaStream;
  setOpenExitModal: React.Dispatch<SetStateAction<boolean>>;
}

function ExitModal({ stream, setOpenExitModal }: PropsType) {
  const navigate = useNavigate();
  function handleExitClick() {
    setOpenExitModal((prev) => !prev);
  }

  // function stopStream() {
  //   stream.getTracks().forEach((track) => track.stop());

  //   // setPlaying(false);
  // }

  function handleSaveClick() {
    //TODO: 저장 요청도 같이 보내야함
    console.log("저장 후 종료!!");
    // stopStream();
    navigate("/");
  }
  return (
    <Modal open={true} cannotExit={false}>
      <div>
        <h1 className="m-2 text-xl font-bold">대화 종료</h1>
        <p className="m-2">
          대화를 저장하고
          <br />
          종료하시겠습니까?
        </p>
      </div>
      <div className=" grid w-full grid-flow-col grid-cols-2 justify-center gap-2 px-4 ">
        <div className="flex w-full">
          <Button onClick={handleExitClick} type="redTextBtn">
            취소
          </Button>
        </div>
        <div className="flex w-full">
          <Button onClick={handleSaveClick} type="redBgBtn">
            저장 후 종료
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ExitModal;
