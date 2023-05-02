import React, { SetStateAction } from "react";
import { Button, Modal } from "@/components";

const mockData = [
  {
    id: 1,
    content: "밥 먹었어?",
  },
  {
    id: 2,
    content: "뭐 먹었어?",
  },
  {
    id: 3,
    content: "고기 먹었어?",
  },
  {
    id: 4,
    content: "짜장면 먹었어?",
  },
  {
    id: 5,
    content: "스시 먹었어?",
  },
];

interface PropsType {
  inputRef: React.RefObject<HTMLTextAreaElement>;
  setOpenFavModal: React.Dispatch<SetStateAction<boolean>>;
}

function FavContents({ inputRef, setOpenFavModal }: PropsType) {
  function handleClick(value: string) {
    setOpenFavModal((prev) => !prev);
    if (inputRef.current) inputRef.current.value = value;
  }
  return (
    <Modal open={true} cannotExit={false}>
      <h4 className="mb-3 text-lg font-bold">자주 쓰는 말</h4>
      <div className="flex flex-col gap-3 ">
        {mockData.map((item) => {
          return (
            <div className="flex justify-end" key={item.id}>
              <Button
                type="contentBtn"
                onClick={() => handleClick(item.content)}
              >
                {item.content}
              </Button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

export default FavContents;
