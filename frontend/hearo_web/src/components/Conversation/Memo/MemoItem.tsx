import React, { SetStateAction } from "react";
import { MemoType } from "@/types/types";
import { ReactComponent as CrossIconRed } from "@/assets/Icon/CrossIconRed.svg";
import { useDispatch } from "react-redux";
import { meetingAction } from "@/redux/modules/meeting";

interface PropsType {
  item: MemoType;
  idx: number;
  setMemoList?: React.Dispatch<SetStateAction<MemoType[]>>;
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

  function deleteMemoInMeeting() {
    if (setMemoList) {
      setMemoList((prev) => {
        return prev.filter((item, i) => i !== idx);
      });
      dispatch(meetingAction.deleteMemo(idx));
    }
  }
  return (
    <div className="relative w-full rounded-md p-2 shadow-xl">
      <div>
        <p className="memoCreatedAt text-sm text-gray-400">
          {parsing(item.timestamp)}
        </p>
        <p className="memoContent">{item.content}</p>
      </div>

      <>
        {setMemoList ? (
          <div className="absolute right-1 top-1" onClick={deleteMemoInMeeting}>
            <CrossIconRed />
          </div>
        ) : null}
      </>
    </div>
    // <div className="relative w-full rounded-md border border-gray-200 p-2">
    //   <div>
    //     <p className="memoCreatedAt text-sm text-gray-400">
    //       {parsing(item.timestamp)}
    //     </p>
    //     <p className="memoContent">{item.content}</p>
    //   </div>

    //   <>
    //     {setMemoList ? (
    //       <div className="absolute right-1 top-1" onClick={deleteMemoInMeeting}>
    //         <CrossIconRed />
    //       </div>
    //     ) : null}
    //   </>
    // </div>
  );
}
export default MemoItem;
