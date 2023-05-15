import { MemoType } from "@/types/types";
import React from "react";

interface PropsType {
  item: MemoType;
}
interface TimeFormat {
  minutes: string;
  seconds: string;
}
function MemoItem({ item }: PropsType) {
  function parsing(sec: number) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    const timeFormat: TimeFormat = {
      minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
    };
    return `${timeFormat.minutes}:${timeFormat.seconds}`;
  }
  return (
    <div className="w-80 rounded-md border border-gray-200 p-2">
      <p className="memoCreatedAt text-sm text-gray-400">
        {parsing(item.timestamp)}
      </p>
      <p className="memoContent">{item.content}</p>
    </div>
  );
}
export default MemoItem;
