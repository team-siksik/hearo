import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { MemoList } from "@/components";
import { motion, AnimatePresence } from "framer-motion";
import { MemoType } from "@/types/types";

interface PropsType {
  openMemoPage: boolean;
  memoList: MemoType[];
  setMemoList: React.Dispatch<SetStateAction<MemoType[]>>;
}
function MemoComp({ openMemoPage, memoList, setMemoList }: PropsType) {
  const [textareaValue, setTextareaValue] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  function addMemo() {
    console.log(textareaRef.current!.value); // TODO: memoList에 append 해주기
    setMemoList((prev) => [
      ...prev,
      {
        content: textareaValue,
        createdAt: 3422,
      },
    ]);
    setTextareaValue(""); // Reset textarea value
    textareaRef.current!.value = "";
  }
  return (
    <section className="h-full border-l border-gray-300 px-2">
      <div className="memoTitle">
        <h5 className="text-lg font-bold">메모장</h5>
        <MemoList memoList={memoList} />
      </div>
      <div className="memoInput mt-3 h-[20%] w-full">
        {/* textarea style 적용, 최대 글자수 제한 */}
        {/* <input type="text" className="w-full border" /> */}
        <textarea
          name="memo"
          className="resize-none border border-gray-200 p-2"
          id="memo"
          //TODO: 수정
          cols={30}
          rows={5}
          maxLength={500}
          ref={textareaRef}
          placeholder="메모 작성하기"
          onChange={(e) => setTextareaValue(e.target.value)}
        ></textarea>
        <div className="addMemoBtnBox">
          <button className="addMemoBtn" type="button" onClick={addMemo}>
            추가
          </button>
        </div>
      </div>
    </section>
  );
}

export default MemoComp;
