import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { MemoList } from "@/components";
import { motion, AnimatePresence } from "framer-motion";
import { MemoType } from "@/types/types";

interface PropsType {
  openMemoPage: boolean;
  memoList: MemoType[];
  setMemoList: React.Dispatch<SetStateAction<MemoType[]>>;
  seconds: number;
}
function MemoComp({ openMemoPage, memoList, setMemoList, seconds }: PropsType) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSendClick() {
    // 내가 input창의 내용 보내기 및 읽기
    if (textareaRef.current?.value.trim() !== "") {
      const msg = textareaRef.current?.value ?? "";
      setMemoList((prev) => [
        ...prev,
        {
          content: msg,
          timestamp: seconds,
        },
      ]);
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
    }
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.nativeEvent.isComposing) {
      // isComposing 이 true 이면
      return; // 조합 중이므로 동작을 막는다.
    }

    if (e.key === "Enter" && e.shiftKey) {
      // [shift] + [Enter] 치면 걍 리턴
      return;
    } else if (e.key === "Enter") {
      handleSendClick();
      e.preventDefault();
    }
  }

  return (
    <section className="h-full border-l border-gray-300 px-2">
      <div className="memoTitle">
        <h5 className="mb-2 text-lg font-bold">메모장</h5>
        <MemoList memoList={memoList} />
      </div>
      <div className="memoInput relative mt-3 h-[22%] w-full rounded-lg border border-gray-200">
        <textarea
          name="memo"
          className="h-[5.5rem] w-full resize-none rounded-lg p-2 focus:border-none focus:outline-none"
          id="memo"
          //TODO: 수정
          maxLength={500}
          ref={textareaRef}
          placeholder="메모 작성하기"
          onKeyDown={handleKeyDown}
        ></textarea>
        <div className="addMemoBtnBox absolute bottom-1 right-2 flex items-center">
          <button
            className="addMemoBtn h-8 rounded-lg border border-blue-200 px-4"
            type="button"
            onClick={handleSendClick}
          >
            추가
          </button>
        </div>
      </div>
    </section>
  );
}

export default MemoComp;
