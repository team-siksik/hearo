import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { RecordpageSideBar } from "@/components";
=======
import {
  RecordpageSideBar,

} from "@/components";
>>>>>>> dd6cfd9 ([S08P31A603-362] api 추가 및 전체대화기록페이지 테스트코드 추가)
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
  // useEffect(() => {
  //   RecordAPI.getRecords(accessToken!)
  //     .then((response) => {
  //       setTotalRecords(response.data);
  //       console.log(response.data);
  //       console.log(totalRecords)
  //       console.log('나오나?');
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

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

<<<<<<< HEAD
  const handleRemoveRecord = (idToDelete: number) => {
    const updatedRecords = totalRecords.filter(
      (record) => record.recordSeq !== idToDelete
    );
=======
  const handleRemoveRecord = (idToDelete:number) => {
    const updatedRecords = totalRecords.filter((record) => record.recordSeq !== idToDelete);
>>>>>>> dd6cfd9 ([S08P31A603-362] api 추가 및 전체대화기록페이지 테스트코드 추가)
    setTotalRecords(updatedRecords);
    setOpenRemoveRecordModal(false);
  };

  // TODO: 기록이 없으면 없는 걸로 보여줘야함
  // const showRecords = () => {
<<<<<<< HEAD
  //   if (noRecords)
  //     return ('no record')
  //   else
  //     return(
=======
  //   if (noRecords) 
  //     return ('no record') 
  //   else 
  //     return( 
>>>>>>> dd6cfd9 ([S08P31A603-362] api 추가 및 전체대화기록페이지 테스트코드 추가)
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
<<<<<<< HEAD
            {totalRecords &&
              totalRecords.map((records) => (
                <div key={records.recordSeq}>
                  <h3>{records.title}</h3>
                  <p>{records.preview}</p>
                </div>
              ))}
=======
          {totalRecords && 
          totalRecords.map((records) => (
            <div key={records.recordSeq}>
            <h3>{records.title}</h3>
            <p>{records.preview}</p>
          </div>
          ))}
>>>>>>> dd6cfd9 ([S08P31A603-362] api 추가 및 전체대화기록페이지 테스트코드 추가)
          </div>
        </div>
      </div>
    </div>
  );
}

export default TotalRecordsPage;

<<<<<<< HEAD
=======

>>>>>>> dd6cfd9 ([S08P31A603-362] api 추가 및 전체대화기록페이지 테스트코드 추가)
// {totalRecords.map((record) => (
//   <RecordsItem
//     key={record.id}
//     recordId={record.id}
//     title={record.title}
//     date={record.date}
//     description={record.description}
//     onRemove={() => handleRemoveRecord(record.id)}
//     onChangeTitle={(newTitle) => handleChangeTitle(record.id, newTitle)}
//   />
// ))}
