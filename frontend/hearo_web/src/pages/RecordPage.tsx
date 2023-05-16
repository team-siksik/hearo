import { TrashIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { RemoveRecordModal } from "@/components";
import React, { useState, useEffect } from "react";
import { RecordpageSideBar } from "@/components";
import { RecordAPI } from "@/apis/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import { getRecordDetail } from "@/redux/modules/records";
import {
  MemoFromServerType,
  RecordItemType,
  RecordListType,
} from "@/types/types";

function RecordPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(getRecordDetail(Number(location.pathname.substring(9))));
  }, [location]);

  // 게별기록조회
  const recordData = useAppSelector(
    (state) => state.record.recordData
  ) as RecordItemType;

  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
  }, []);

  // const [newTitle, setTitle] = useState(initialTitle);
  const [openRemoveRecordModal, setOpenRemoveRecordModal] =
    useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [newTitle, setNewTitle] = useState<string>("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewTitle(e.target.value);
    console.log(e.target.value);
  };

  // useEffect(() => {
  //   setNewTitle("");
  // }, []);

  // 기록제목수정 FIXME: 위에랑 어떻게 겹치는 것인가?
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      // access token이 없을 때 처리하는 부분
      return;
    }
    //   RecordAPI.updateRecordTitle(accessToken, recordSeq, newTitle)
    //     .then(() => {
    //       onChangeTitle(newTitle);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       // 에러 처리하는 부분
    //     });
  };

  const moveToRecords = () => {
    navigate(`/records`);
  };

  function handleDeleteClick() {
    setOpenRemoveRecordModal(true);
  }

  // 기록삭제
  // FIXME: deleterecordseqlist 수정해야함
  const [deleteRecordSeqList, setDeleteRecordIds] = useState<number[] | any>(
    []
  );
  const handleRemoveRecord = () => {
    const accessToken = localStorage.getItem("accessToken");
    // const deleteRecordSeqList = [11, 13];
    RecordAPI.deleteRecord(accessToken!, deleteRecordSeqList)
      .then(() => {
        setOpenRemoveRecordModal(false);
        // TODO: 리다이렉트 처리
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <RecordpageSideBar />
      <div className="fixed right-0 mt-[4.25rem] w-[82%]">
        <div className="mx-8">
          <div className="flex items-stretch justify-between ">
            <div className="flex flex-row items-center">
              <div className="self-center rounded-lg text-3xl font-bold text-gray-600">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    defaultValue={recordData.title}
                    onChange={handleTitleChange}
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

          {/* TODO: 여기서부터 개별정보 가져오는거 만들어야함 map 활용 */}
          <div className="flex flex-col rounded-md border p-4 shadow-md">
            <div className="flex flex-row items-center">
              <h2 className="mr-2 font-semibold">녹음 정보</h2>
              <div className="flex-grow border-b"></div>
            </div>
            <div className="mt-4">
              <div className="my-2 flex flex-row items-center">
                <h3 className="mr-2 text-gray-600">
                  녹음일시: {recordData?.regDtm}
                </h3>
                <p className="font-bold">{recordData.recordingTime}</p>
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
              <div>
                {/* {data.map((datas) => (
                  <div>
                    {datas.title}
                    {datas.recordingTime}
                    {datas.regDtm}
                    {datas.modDtm}
                  </div>
                ))} */}
                {recordData.memoList?.map((memo: MemoFromServerType) => (
                  <li key={memo.memoSeq}>
                    <span>{memo.timestamp}</span>
                    <span>{memo.content}</span>
                  </li>
                ))}
              </div>
            </div>
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
