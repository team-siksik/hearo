import React from "react";

interface PropsType {}

function MemoItem({}: PropsType) {
  return (
    <div className="w-80 rounded-md border border-gray-200 p-2">
      <p>04:23</p>
      <p>오호 그래서 이렇게 됐다 이거지? </p>
    </div>
  );
}
export default MemoItem;
