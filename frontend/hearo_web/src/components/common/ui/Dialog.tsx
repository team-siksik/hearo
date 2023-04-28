import React from "react";

interface PropsType {
  type?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function Dialog({ type, children, onClick }: PropsType) {
  return (
    <>
      <div className="flex justify-end">
        {type === "user_text" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl border border-gray-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "other1_text" ? (
          <div className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md">
            {children}
          </div>
        ) : type === "other2_text" ? (
          <div className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md">
            {children}
          </div>
        ) : type === "other3_text" ? (
          <div className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md">
            {children}
          </div>
        ) : type === "other4_text" ? (
          <div className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md">
            {children}
          </div>
        ) : type === "other5_text" ? (
          <div className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md">
            {children}
          </div>
        ) : type === "other6_text" ? (
          <div className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md">
            {children}
          </div>
        ) : type === "other7_text" ? (
          <div className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md">
            {children}
          </div>
        ) : type === "other8_text" ? (
          <div className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md">
            {children}
          </div>
        ) : type === "other9_text" ? (
          <div className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md">
            {children}
          </div>
        ) : type === "other10_text" ? (
          <div className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md">
            {children}
          </div>
        ) : null}
      </div>
    </>
  );
}
export default Dialog;
