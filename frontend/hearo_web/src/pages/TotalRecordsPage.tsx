import React, { useState, useEffect } from "react";
import {
  RecordpageSideBar,

} from "@/components";
import { RecordsItem } from "@/components";
import { RecordAPI } from "@/apis/api";
import { TrashIcon } from "@heroicons/react/24/solid";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import { useNavigate} from "react-router-dom";
import { RemoveRecordModal } from "@/components";
import RecordPage from "./RecordPage";


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
  onChangeTitle: (title: string) => void;
}

function TotalRecordsPage(
  { 
    title,
    onChangeTitle,
    recordSeq, 
    conversationSeq,
    recordingTime,
    preview,
    isFavorite,
    regDtm,
    modDtm,
  } : TotalRecord
  ) { 
  const [openRemoveRecordModal, setOpenRemoveRecordModal] = useState<boolean>(false);
  // const [idToDelete, setIdToDelete] = useState<number>(0);
  // const [noRecords, setNoRecords] = useState<boolean>(false);

  //전체기록조회
  const [totalRecords, setTotalRecords] = useState<TotalRecord[]>([]);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
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

  // const handleRemoveRecord = (idToDelete:number) => {
  //   const updatedRecords = totalRecords.filter((record) => record.recordSeq !== idToDelete);
  //   setTotalRecords(updatedRecords);
  //   setOpenRemoveRecordModal(false);
  // };

  const handleRemoveClick = (idToDelete?:number) => {
    const updatedRecords = totalRecords.filter((record) => record.recordSeq !== idToDelete);
    setTotalRecords(updatedRecords);
    setOpenRemoveRecordModal(false);
  }

  const navigate = useNavigate();
  const moveToRecord = () => {
    navigate(`/records/${recordSeq}`, {
      state: { 
        title,
        onChangeTitle,
        recordSeq, 
        conversationSeq,
        recordingTime,
        preview,
        isFavorite,
        regDtm,
        modDtm,
      },
    })
  };

  // TODO: 기록이 없으면 없는 걸로 보여줘야함
  const showRecords = (totalRecords: TotalRecord[]) => {
    if (totalRecords.length === 0) {
      return <p>표시할 내용이 없습니다</p>;
    }
  };

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
