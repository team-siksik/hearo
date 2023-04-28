import React from "react";

interface PropsType {
  children?: React.ReactNode;
  type?: string;
  onClick: () => void;
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
        <button className="rounded-xl px-4 py-1 shadow-md">{children}</button>
      ) : (
        <button onClick={onClick}>{children}</button>
      )}
    </>
  );
}

export default Button;
