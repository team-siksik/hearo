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
      ) : type === "backButton" ? (
        <button
          className="group relative w-full overflow-hidden rounded-xl border bg-white 
          text-blue-main border-blue-main px-4 py-2 m-4
          shadow-md hover:bg-blue-50 transition-all duration-[250ms] ease-out"
          onClick={onClick}
        >
          <div className="absolute inset-0 w-3  "></div>
          <span className="relative">
            {children}
          </span>
        </button>
      ) : type === "accountButton" ? (
        <button
        className="mr-2 z-100 h-10 rounded-xl bg-white shadow-md shadow-slate-200"
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
      ) : type === "deleteButton" ? (
        <button
        className="group relative w-full overflow-hidden rounded-xl border text-white border-red-main px-4 py-2 m-4
        shadow-md bg-red-500 hover:bg-red-main transition-all duration-[250ms] ease-out"
        onClick={onClick}
      >
        <div className="absolute inset-0 w-3  "></div>
        <span className="relative">
          {children}
        </span>
      </button>
      ) : type === "accountDeleteButton" ? (
        <button
        className="w-full overflow-hidden rounded-xl border text-white border-red-main px-4 py-2 mt-4
        shadow-md bg-red-500 hover:bg-red-main transition-all duration-[250ms] ease-out"
        onClick={onClick}
      >
        <span className="relative text-white">
          <div className="text-center"> 
          {children}
          </div>
        </span>
        </button>
      ) : type === "accountLogoutButton" ? (
        <button
        className="w-full overflow-hidden rounded-xl border text-white border-gray-400 px-4 py-2
        shadow-md bg-white hover:bg-gray-200 transition-all duration-[250ms] ease-out"
        onClick={onClick}
      >
        <span className="relative text-black">
          <div className="text-center"> 
          {children}
          </div>
        </span>
        </button>
      ) :
      <button onClick={onClick}>
        {children}
        </button>
    }

      </>
  );
}

export default Button;
