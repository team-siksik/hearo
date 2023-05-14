import React, { useState, useEffect } from "react";
import {
  RecordpageSideBar,

} from "@/components";
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
    RecordAPI.getRecords(accessToken!)
      .then((response) => {
        setTotalRecords(response.data);
        console.log(response.data);
        console.log(totalRecords)
        console.log('나오나?');
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 변경된 타이틀?
  const handleChangeTitle = (recordSeq: number, newTitle: string) => {
    const newRecords = totalRecords.map(records => {
      if (records.recordSeq === recordSeq) {
        return {
          ...records,
          title: newTitle
        }
      }
      return records;
    });
    setTotalRecords(newRecords);
  };

  const handleRemoveRecord = (idToDelete:number) => {
    const updatedRecords = totalRecords.filter((record) => record.recordSeq !== idToDelete);
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
      <RecordpageSideBar/>
      <div className="absolute right-0 mt-20 w-[82%] overflow-auto" style={{ paddingTop: "16px" }}>
        <div className="fixed right-0 top-20 bottom-0 overflow-y-scroll" style={{ width: "calc(82% - 1rem)" }}>
          <div className="space-y-4">
            {/* 테스트 */}
          {totalRecords && 
          totalRecords.map((records) => (
            <div key={records.recordSeq}>
            <h3>{records.title}</h3>
            <p>{records.preview}</p>
          </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  )  
}

export default TotalRecordsPage;


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
