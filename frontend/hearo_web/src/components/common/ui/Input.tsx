import React, { useRef } from "react";

interface PropsType {
  type?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

function Input({ type, inputRef, onKeyDown }: PropsType) {
  return (
    <>
      {type === "InputFull" ? (
        <div className="relative rounded-md shadow-sm">
          <textarea
            onKeyDown={onKeyDown}
            ref={inputRef}
            name="context"
            id="context"
            className="block h-9 w-full resize-none overflow-auto rounded-md border-0 py-1.5 pl-2  pr-2 text-gray-900 !outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
            placeholder="대화를 입력해주세요"
          />
        </div>
      ) : (
        <input type="text" />
      )}
    </>
  );
}

export default Input;
