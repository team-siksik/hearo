import React from "react";
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

function FavContents() {
  function handleClick(value: string) {
    console.log(value);
  }
  return (
    <Modal open={true} cannotExit={false}>
      <h4>자주 쓰는 말</h4>
      <div>
        {mockData.map((item) => {
          return (
            <Button
              type="contentBtn"
              onClick={() => handleClick(item.content)}
              key={item.id}
            >
              {item.content}
            </Button>
          );
        })}
      </div>
    </Modal>
  );
}

export default FavContents;
