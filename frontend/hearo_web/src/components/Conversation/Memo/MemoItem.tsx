import { MemoType } from "@/types/types";
import React from "react";

interface PropsType {
  item: MemoType;
}

function MemoItem({ item }: PropsType) {
  return (
    <div className="w-80 rounded-md border border-gray-200 p-2">
      <p className="memoCreatedAt text-sm text-gray-400">{item.createdAt}</p>
      <p className="memoContent">{item.content}</p>
    </div>
  );
}
export default MemoItem;
