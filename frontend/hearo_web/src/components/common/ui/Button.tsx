import React, { SetStateAction } from "react";

interface PropsType {
  children?: React.ReactNode;
  type?: string;
  onClick: () => void | React.Dispatch<SetStateAction<boolean>>;
}

function Button({ type, children, onClick }: PropsType) {
  return (
    <>
      {type === "exitConversation" ? (
        <button className=" text-red-error" onClick={onClick}>
          대화 종료
        </button>
      ) : // bg-white contentBtnbox-shadow btn
      type === "contentBtn" ? (
        <button onClick={onClick} className="rounded-xl px-4 py-1 shadow-md">
          {children}
        </button>
      ) : type === "redBgBtn" ? (
        <button
          className="w-full rounded-xl bg-red-main px-4 py-2 text-white shadow-md"
          onClick={onClick}
        >
          {children}
        </button>
      ) : type === "redTextBtn" ? (
        <button
          className="w-full rounded-xl border border-red-main px-4 py-2 shadow-md"
          onClick={onClick}
        >
          {children}
        </button>
      ) : (
        <button onClick={onClick}>{children}</button>
      )}
    </>
  );
}

export default Button;
