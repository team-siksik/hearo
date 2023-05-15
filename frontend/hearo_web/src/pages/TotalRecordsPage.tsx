import React, { useState, useEffect } from "react";
import { RecordpageSideBar } from "@/components";
import { RecordsItem } from "@/components";
import axios from "axios";
import { RecordAPI } from "@/apis/api";

// 전체기록페이지
interface TotalRecord {
  recordSeq: number;
  conversationSeq: number;
  title: string;
  recordingTime: string;
  preview: string;
  isFavorite: number;
  regDtm: string;
  modDtm: string;
}

function TotalRecordsPage() {
  const [openRemoveRecordModal, setOpenRemoveRecordModal] =
    useState<boolean>(false);
  // const [idToDelete, setIdToDelete] = useState<number>(0);
  // const [noRecords, setNoRecords] = useState<boolean>(false);

  // TODO: API 설정 추가해야함

  const accessToken = localStorage.getItem("accessToken");

  const [totalRecords, setTotalRecords] = useState<TotalRecord[]>([]);
  useEffect(() => {
    RecordAPI.getRecords(accessToken!, 0)
      .then((response) => {
        console.log(response.data.data.recordList);
        setTotalRecords(response.data.data.recordList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

  const handleRemoveRecord = (idToDelete: number) => {
    const updatedRecords = totalRecords.filter(
      (record) => record.recordSeq !== idToDelete
    );
    setTotalRecords(updatedRecords);
    setOpenRemoveRecordModal(false);
  };

  // TODO: 기록이 없으면 없는 걸로 보여줘야함
  // const showRecords = () => {
  //   if (noRecords)
  //     return ('no record')
  //   else
  //     return(
  //       {totalRecords}
  //     )
  //   }

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
          <div className="space-y-4">
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
