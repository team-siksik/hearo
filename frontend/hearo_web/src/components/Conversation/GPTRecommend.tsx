import React, { SetStateAction } from "react";
import { Modal } from "@/components";

interface PropsType {
  setOpenGPTModal: React.Dispatch<SetStateAction<boolean>>;
}

function GPTRecommend({ setOpenGPTModal }: PropsType) {
  return (
    <Modal open={true} cannotExit={false} setOpenGPTModal={setOpenGPTModal}>
      "gpt추천"
    </Modal>
  );
}

export default GPTRecommend;
