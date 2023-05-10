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
        ) : type === "other1_text" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "other2_text" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "other3_text" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "other4_text" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "other5_text" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "other6_text" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "other7_text" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "other8_text" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "other9_text" ? (
          <div
            onClick={onClick}
            className="user_dialog m-2 inline-block h-fit w-fit max-w-sm rounded-xl bg-red-100 p-2 shadow-md"
          >
            {children}
          </div>
        ) : type === "other10_text" ? (
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
