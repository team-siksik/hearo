import React, { SetStateAction, useEffect } from "react";
import { Button, Modal } from "@/components";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ProfileAPI } from "@/apis/api";
import { getFrequent } from "@/redux/modules/profile";

interface PropsType {
  inputRef: React.RefObject<HTMLTextAreaElement>;
  setOpenFavModal: React.Dispatch<SetStateAction<boolean>>;
}

function FavContents({ inputRef, setOpenFavModal }: PropsType) {
  function handleClick(value: string) {
    setOpenFavModal((prev) => !prev);
    if (inputRef.current) inputRef.current.value = value;
  }
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFrequent());
  }, []);

  const favContent = useAppSelector((state) => state.profile.FrequentList);

  return (
    <Modal open={true} cannotExit={false}>
      <h4 className="mb-3 text-lg font-bold">자주 쓰는 말</h4>
      <div className="flex flex-col gap-3 ">
        {favContent.map((item) => {
          return (
            <div className="flex justify-end" key={item.frequentSeq}>
              <Button
                type="contentBtn"
                onClick={() => handleClick(item.sentence)}
              >
                {item.sentence}
              </Button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

export default FavContents;
