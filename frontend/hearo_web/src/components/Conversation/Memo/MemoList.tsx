import React, { useEffect, useRef } from "react";
import { MemoItem } from "@/components";
import { MemoType } from "@/types/types";

interface PropsType {
  memoList: MemoType[];
}

function MemoList({ memoList }: PropsType) {
  // 채팅창 늘어날수록 스크롤 맨 밑으로 이동
  const memoEndRef = useRef<HTMLDivElement>(null);
  // 채팅창 늘어날수록 스크롤 맨 밑으로 이동
  useEffect(() => {
    if (memoEndRef.current)
      memoEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [memoList]);

  return (
    <div className="flex h-[288px] flex-col gap-2 overflow-auto overflow-x-auto pb-2">
      {memoList?.map((item, idx) => {
        return <MemoItem key={idx} item={item} />;
      })}
      <div ref={memoEndRef}></div>
    </div>
  );
}
export default MemoList;