import { MeetingAPI, ProfileAPI } from "@/apis/api";
import Button from "@/components/common/ui/Button";
import Modal from "@/components/common/ui/Modal";
import { useAppDispatch } from "@/redux/hooks";
import { addFrequent } from "@/redux/modules/profile";
import React, { SetStateAction } from "react";
import { useDispatch } from "react-redux";

interface PropsType {
  setOpenAddFavModal: React.Dispatch<SetStateAction<boolean>>;
  chosenFavItem: string;
}

export default function AddFavModal({
  setOpenAddFavModal,
  chosenFavItem,
}: PropsType) {
  const dispatch = useAppDispatch();
  function handleAddFav() {
    dispatch(addFrequent(chosenFavItem));
    setOpenAddFavModal(false); //TODO: 모달 바로 꺼지게! 저장되었습니다!
  }

  return (
    <Modal
      open={true}
      cannotExit={false}
      setOpenAddFavModal={setOpenAddFavModal}
    >
      <h3>자주 쓰는 말 추가</h3>
      <p>자주 사용하시는 말로 추가하시겠습니까?</p>
      <div>
        <Button
          onClick={() => setOpenAddFavModal(false)}
          type="accountDeleteButton"
        >
          아니오
        </Button>
        <Button onClick={handleAddFav} type="addButton">
          추가하기
        </Button>
      </div>
    </Modal>
  );
}
