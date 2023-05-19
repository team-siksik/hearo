import { TrashIcon } from "@heroicons/react/24/solid";
import { ReactComponent as CrossIconRed } from "@/assets/Icon/CrossIconRed.svg";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  Button,
  Dialog,
  FloatingButton,
  MemoItem,
  MypageSideBar,
  RemoveRecordModal,
} from "@/components";
import React, { useState, useEffect, useRef } from "react";
import { RecordpageSideBar } from "@/components";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ReactComponent as Caretdown } from "@/assets/Icon/Caretdown.svg";
import { ReactComponent as Caretup } from "@/assets/Icon/Caretup.svg";
import {
  changeRecordTitleAsync,
  deleteMemoAsync,
  getRecordDetail,
} from "@/redux/modules/records";
import { MemoFromServerType, RecordItemType } from "@/types/types";

interface DialogType {
  confidence: number;
  diarization: {
    label: string;
  }[];
  end: number;
  speaker: { label: string; name: string; edited: boolean };
  start: number;
  text: string;
  textEdited: string;
  words: [number, number, string][];
}
interface TimeFormat {
  minutes: string;
  seconds: string;
}

function RecordPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const controls = useAnimation();
  const [dialog, setDialog] = useState<DialogType[]>([]);
  const [openMemo, setOpenMemo] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getRecordDetail(Number(location.pathname.substring(9))));
  }, [location]);

  const formatTime = (time: number): string => {
    let sec = 0;
    if (time > 0) {
      const text = time.toString().slice(0, -3);
      sec = Number(text);
    }
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    const timeFormat: TimeFormat = {
      minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
    };
    return `${timeFormat.minutes}:${timeFormat.seconds}`;
  };

  // 개별 기록 조회
  const recordData = useAppSelector(
    (state) => state.record.recordData
  ) as RecordItemType;

  useEffect(() => {
    if (recordData.clovaFile) {
      setDialog(JSON.parse(recordData.clovaFile).segments);
    }
    return () => {};
  }, [recordData]);

  // const [newTitle, setTitle] = useState(initialTitle);
  const [openRemoveRecordModal, setOpenRemoveRecordModal] =
    useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [newTitle, setNewTitle] = useState<string>("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const moveToRecords = () => {
    navigate(-1);
  };

  function handleDeleteClick() {
    setOpenRemoveRecordModal(true);
  }

  //TODO: memo delete
  function deleteMemo(memoSeq: number) {
    const delItem = {
      memoSeq: [memoSeq],
      recordSeq: recordData.recordSeq,
    };
    dispatch(deleteMemoAsync(delItem));
  }

  function changeRecordTitle(e: React.KeyboardEvent) {
    const data = {
      newTitle: newTitle,
      recordSeq: recordData.recordSeq,
    };
    if (e.key === "Enter") {
      dispatch(changeRecordTitleAsync(data))
        .then(() => {
          inputRef.current?.blur();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function addMemo() {
    setOpenMemo((prev) => !prev);
  }

  function handleInfoButton() {
    setShowInfo((prev) => !prev);
  }

  return (
    <div>
      <MypageSideBar />
      <div className="absolute right-0 mt-[4.25rem] w-[82%]">
        <div className="mx-8">
          <div className="flex items-stretch justify-between ">
            <div className="flex min-w-[400px] flex-row items-center">
              <div className="w-full self-center rounded-lg text-3xl font-bold text-gray-600">
                <form onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    ref={inputRef}
                    defaultValue={recordData.title}
                    onChange={handleTitleChange}
                    onKeyDown={changeRecordTitle}
                    placeholder="제목을 입력해주세요"
                    className="w-full rounded-lg p-2 hover:cursor-pointer hover:outline"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </form>
              </div>
              {isHovered || isFocused ? (
                <div className="ml-4 h-10 w-10 self-center text-gray-600">
                  <PencilSquareIcon />
                </div>
              ) : recordData.title ? null : (
                <div className="ml-4 h-10 w-10 self-center text-gray-600">
                  <PencilSquareIcon />
                </div>
              )}
            </div>
            <div className="mr-4 flex  flex-row">
              <div className="m-4 p-1">
                <button
                  className="w-20 rounded-full bg-red-main py-2 text-white transition-all duration-200 ease-out hover:bg-red-400"
                  onClick={moveToRecords}
                >
                  Back
                </button>
              </div>
              <div
                className="mx-2 my-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 font-semibold text-red-main transition-all duration-200 ease-out hover:bg-red-300 hover:shadow-sm"
                onClick={handleDeleteClick}
              >
                <div className="h-6 w-6">
                  <TrashIcon />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-2 flex flex-col rounded-md border p-4 shadow-md ">
            <div
              className="flex flex-row items-center"
              onClick={handleInfoButton}
            >
              <h2 className="mr-2 font-semibold">녹음 정보</h2>
              <div className="flex-grow border-b"></div>
              {showInfo ? (
                <div className="px-2">
                  <Caretup />
                </div>
              ) : (
                <div className="px-2">
                  <Caretdown />
                </div>
              )}
            </div>
            {showInfo && (
              <div className="mt-4">
                <div className="my-2  items-center">
                  <p className="mr-2 text-gray-600">
                    녹음 일시: {recordData?.regDtm}
                  </p>
                  <p className="mr-2 text-gray-600">
                    녹음 길이: {recordData.recordingTime}
                  </p>
                </div>
                {/* <div className="my-2 flex flex-row items-center">
                <h3 className="mr-2 text-gray-600">
                  즐겨찾기: {recordData.isFavorite}
                </h3>
                <p>
                  {recordData.isFavorite
                    ? "즐겨찾기에 추가됨"
                    : "즐겨찾기에 추가되지 않음"}
                </p>
              </div> */}
              </div>
            )}
          </div>
          <div className="mb-32 flex scroll-mx-0 flex-row">
            <motion.div
              key="left"
              // className={
              //   recordData?.memoList?.length > 0 ? "grid grid-cols-3 gap-4" : ""
              // }
              style={{
                maxHeight: "600px",
                width:
                  openMemo || recordData.memoList?.length > 0 ? "70%" : "100%",
                transition: "width 0.5s",
                // overflow: "auto",
              }}
            >
              <div className="my-4 flex w-full flex-col rounded-md p-4 shadow-md">
                {dialog &&
                  dialog.map((item, idx) => (
                    // TODO: ADD Favorite Context
                    <div key={item.start}>
                      <div>{item.speaker.name}</div>
                      <div className="flex flex-row items-center">
                        <Dialog type={item.speaker.label}>{item.text}</Dialog>
                        <div className="text-sm text-gray-400">
                          {formatTime(item.start)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
            <AnimatePresence>
              {openMemo && (
                <motion.div
                  key="right"
                  style={{
                    width: "30%",
                    minHeight: "100px",
                  }}
                  initial={{ width: "0%", minHeight: "100px" }}
                  animate={{ width: "30%", minHeight: "0" }}
                  exit={{ width: "0%", minHeight: "100px" }}
                  transition={{ duration: 0.3 }}
                >
                  {recordData?.memoList?.length > 0 ? (
                    <div className="h-full border-l border-gray-300 px-2">
                      {recordData.memoList.map(
                        (item: MemoFromServerType, idx) => {
                          return (
                            <div key={item.memoSeq} className="relative mb-3">
                              <MemoItem item={item} idx={idx} />
                              <div
                                className="absolute right-4 top-0 w-4"
                                onClick={(e) => deleteMemo(item.memoSeq)}
                              >
                                <CrossIconRed />
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="memoInput relative mt-3 w-full rounded-lg border border-gray-200">
                      <textarea
                        name="memo"
                        className="h-[5.5rem] w-full resize-none rounded-lg p-2 focus:border-none focus:outline-none"
                        id="memo"
                        maxLength={500}
                        // ref={textareaRef}
                        placeholder="메모 작성하기"
                        // onKeyDown={handleKeyDown}
                      ></textarea>
                      <div className="addMemoBtnBox absolute bottom-1 right-2 flex items-center">
                        <button
                          className="addMemoBtn h-8 rounded-lg bg-blue-100 px-4 hover:bg-blue-200"
                          type="button"
                          // onClick={handleSendClick}
                        >
                          추가
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div onClick={addMemo}>
            <FloatingButton type="memoInRecord"></FloatingButton>
          </div>
          <div className="audio mb-4">
            <audio
              src={recordData.recordedFileUrl}
              controls
              className="w-full"
            />
          </div>
        </div>
        {openRemoveRecordModal && (
          <RemoveRecordModal
            setOpenRemoveRecordModal={setOpenRemoveRecordModal}
            type="inRecordItem"
            recordSeq={recordData.recordSeq}
          />
        )}
      </div>
    </div>
  );
}

export default RecordPage;
