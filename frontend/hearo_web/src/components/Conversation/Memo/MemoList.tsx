import React from "react";
import { MemoItem } from "@/components";

interface PropsType {}

function MemoList() {
  return (
    <div className="flex flex-col gap-2">
      <MemoItem />
      <MemoItem />
      <MemoItem />
    </div>
  );
}
export default MemoList;
