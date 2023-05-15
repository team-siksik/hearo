import React, { useState, useEffect } from "react";
import { RecordpageSideBar } from "@/components";
import { RecordsItem } from "@/components";
import { RecordAPI } from "@/apis/api";
import { TrashIcon } from "@heroicons/react/24/solid";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import { RemoveRecordModal } from "@/components";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useNavigate } from "react-router-dom";
import { getRecordList } from "@/redux/modules/records";

// 전체기록페이지
interface RecordItem {
  recordSeq: number;
  conversationSeq: number;
  title: string;
  recordingTime: string;
  preview: string;
  isFavorite: number;
  regDtm: string;
  modDtm: string;
  onChangeTitle: (title: string) => void;
}

function TotalRecordsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [nextPage, setNextPage] = useState<number>(0);
  const [openRemoveRecordModal, setOpenRemoveRecordModal] =
    useState<boolean>(false);

  const [totalRecords, setTotalRecords] = useState<RecordItem[]>([]);
  const recordList = useAppSelector((state) => state.record.recordList);
  useEffect(() => {
    dispatch(getRecordList(nextPage));
  }, []);
  useEffect(() => {
    console.log(recordList);
    setTotalRecords(recordList);
  }, [recordList]);

  // useEffect(() => {
  //   setTotalRecords((prev) => [...prev, ...recordList]);
  // }, [recordList]);

  // 변경된 타이틀?
  const handleChangeTitle = (recordSeq: number, newTitle: string) => {
    const newRecords = totalRecords.map((records) => {
      if (records.recordSeq === recordSeq) {
        return {
          ...records,
          title: newTitle,
        };
      }
      return records;
    });
    setTotalRecords(newRecords);
  };

  // const handleRemoveRecord = (idToDelete:number) => {
  //   const updatedRecords = totalRecords.filter((record) => record.recordSeq !== idToDelete);
  //   setTotalRecords(updatedRecords);
  //   setOpenRemoveRecordModal(false);
  // };

  const handleRemoveClick = (idToDelete?: number) => {
    const updatedRecords = totalRecords.filter(
      (record) => record.recordSeq !== idToDelete
    );
    setTotalRecords(updatedRecords);
    setOpenRemoveRecordModal(false);
  };

  // // TODO: 기록이 없으면 없는 걸로 보여줘야함
  // const showRecords = (totalRecords: TotalRecord[]) => {
  //   if (totalRecords.length === 0) {
  //     return <p>표시할 내용이 없습니다</p>;
  //   }
  // };

  return (
    <div>
      <RecordpageSideBar />
      <div
        className="absolute right-0 mt-20 w-[82%] overflow-auto"
        style={{ paddingTop: "16px" }}
      >
        <div
          className="fixed bottom-0 right-0 top-20 overflow-y-scroll"
          style={{ width: "calc(82% - 1rem)" }}
        >
          <div className="space-y-4 pb-12">
            {/* 테스트 */}
            {totalRecords &&
              totalRecords.map((records, idx) => (
                <RecordsItem record={records} key={idx} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TotalRecordsPage;
