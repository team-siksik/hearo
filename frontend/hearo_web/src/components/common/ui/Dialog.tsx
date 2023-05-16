import React, { SetStateAction } from "react";
import { useLongPress } from "use-long-press";

interface PropsType {
  type?: string;
  children: React.ReactNode;
  setOpenAddFavModal?: React.Dispatch<SetStateAction<boolean>>;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

// TODO: 화자별로 색깔 다르게 분리해야 함
function Dialog({ type, children, setOpenAddFavModal, onClick }: PropsType) {
  const onLongPress = useLongPress(() => {
    if (setOpenAddFavModal) setOpenAddFavModal(true);
  });

  return (
    <>
      <div>
        {type === "user_text" ? (
          <div className="flex justify-end">
            <div
              {...onLongPress()}
              onClick={onClick}
              className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl border border-gray-100 p-2 shadow-md"
            >
              {children}
            </div>
          </div>
        ) : type === "1" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "2" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "3" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "4" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "5" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "6" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "7" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "8" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "9" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "10" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : null}
      </div>
    </>
  );
}
export default Dialog;
