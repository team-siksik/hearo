import React, { SetStateAction } from "react";
import { MemoType } from "@/types/types";
import { ReactComponent as CrossIconRed } from "@/assets/Icon/CrossIconRed.svg";
import { useDispatch } from "react-redux";
import { meetingAction } from "@/redux/modules/meeting";

interface PropsType {
  item: MemoType;
  idx: number;
  setMemoList: React.Dispatch<SetStateAction<MemoType[]>>;
}
interface TimeFormat {
  minutes: string;
  seconds: string;
}
function MemoItem({ item, idx, setMemoList }: PropsType) {
  const dispatch = useDispatch();

  function parsing(sec: number) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    const timeFormat: TimeFormat = {
      minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
    };
    return `${timeFormat.minutes}:${timeFormat.seconds}`;
  }

  function deleteMemo() {
    setMemoList((prev) => {
      return prev.filter((item, i) => i !== idx);
    });
    dispatch(meetingAction.deleteMemo(idx));
  }
  return (
    <div className="relative w-full rounded-md border border-gray-200 p-2">
      <div className="">
        <p className="memoCreatedAt text-sm text-gray-400">
          {parsing(item.timestamp)}
        </p>
        <p className="memoContent">{item.content}</p>
      </div>
      <div className="absolute right-1 top-1" onClick={deleteMemo}>
        <CrossIconRed />
      </div>
    </div>
  );
}
export default MemoItem;
