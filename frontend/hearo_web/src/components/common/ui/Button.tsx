import { css } from "@emotion/react";
import React, { SetStateAction } from "react";

interface PropsType {
  children?: React.ReactNode;
  type?: string;
  onClick?: () => void | React.Dispatch<SetStateAction<boolean>>;
}


function Button({ type, children, onClick }: PropsType) {
  return (
    <>
      {type === "exitConversation" ? (
        <button className=" text-red-error" onClick={onClick}>
          대화 종료
        </button>
      ) : type === "contentBtn" ? ( // bg-white contentBtnbox-shadow btn
        <button onClick={onClick} className="rounded-xl px-4 py-1 shadow-md">
          {children}
        </button>
      ) : type === "blueBgBtn" ? (
        <button
          className="group relative w-full transform overflow-hidden rounded-xl bg-blue-main px-4 py-2 shadow-md "
          onClick={onClick}
        >
          <div className="absolute inset-0 w-3 bg-white transition-all duration-[250ms] ease-out group-hover:w-full"></div>
          <span className="relative text-white group-hover:text-blue-main">
            {children}
          </span>
        </button>
      ) : type === "blueTextBtn" ? (
        <button
          className="group relative w-full overflow-hidden rounded-xl border border-blue-main px-4 py-2 shadow-md"
          onClick={onClick}
        >
          <div className="absolute inset-0 w-3 bg-blue-main transition-all duration-[250ms] ease-out group-hover:w-full"></div>
          <span className="relative text-blue-main group-hover:text-white">
            {children}
          </span>
        </button>
      ) : type === "whiteButton" ? (
        <button
          className="h-10 rounded-xl bg-white shadow-md shadow-slate-200 "
          onClick={onClick}
          // css={css`
          //   width: 90vw;
          // `}
        >
          {children}
        </button>
      ) : type === "accountButton" ? (
        <button
        className="absolute z-100 h-10 rounded-xl bg-white shadow-md shadow-slate-200"
        onClick={onClick}
        >
          {children}
        </button> 
        ) : type === "accountModalButton" ? (
          <button
          className="group w-full transform overflow-hidden rounded-xl bg-white my-2 px-2 py-2"
          onClick={onClick}
        >
          <div className="absolute inset-0 w-0 bg-blue-200 transition-all duration-[250ms] ease-out opacity-80 group-hover:w-full"></div>
          <span className="relative text-black">
            <div className="text-start"> 
            {children}
            </div>
          </span>
        </button>
        ) :
        <button onClick={onClick}>
          {children}</button>

      } 
      </>
  );
}

export default Button;
