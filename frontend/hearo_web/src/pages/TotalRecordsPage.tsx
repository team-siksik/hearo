import React, { useState, useEffect } from "react";
import {
  RecordpageSideBar,

} from "@/components";
// import { RecordsItem } from "@/components";
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
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }
    
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
      <RecordpageSideBar/>
      <div className="absolute right-0 mt-20 w-[82%] overflow-auto" style={{ paddingTop: "16px" }}>
        <div className="fixed right-0 top-20 bottom-0 overflow-y-scroll" style={{ width: "calc(82% - 1rem)" }}>
          <div className="space-y-4">
            {/* 테스트 */}
          {/* <div className="px-4 py-2">
          {showRecords(totalRecords)}
          </div> */}
          {showRecords(totalRecords) && 
          totalRecords.map((records) => (
            <div className="mx-10 mt-8 p-4 rounded-2xl font-semibold text-black hover:cursor-pointer hover:bg-blue-50 transition-all duration-300 ease-out shadow-lg">
            <div className="flex flex-row items-stretch justify-between">
              <div onClick={moveToRecord} className="flex items-center">
                <div
                  className="self-center mr-4 font-semibold text-blue-main rounded-full bg-blue-100 w-12 h-12 flex justify-center items-center"
                >
                  <div className="w-6 h-6">
                    <NewspaperIcon />
                  </div>
                </div>
                <div>
                  {/* <div className="font-bold mb-2 cursor-pointer">
                    <RecordPage title={title} onChangeTitle={onChangeTitle} />
                  </div> */}
                  {/* <div className="font-bold mb-2 cursor-pointer">
                    <RecordPage title={title} onChangeTitle={onChangeTitle} />
                  </div> */}
                  <div className="my-2 text-blue-main">{records.title}</div>
                  <div className="text-sm">{records.preview}</div>
                </div>
              </div>
              <div
                className="self-center mr-4 font-semibold text-red-main rounded-full bg-red-50 w-12 h-12 hover:bg-red-300 hover:shadow-sm transition-all duration-200 ease-out flex justify-center items-center"
                onClick={()=> setOpenRemoveRecordModal(true)}
              >
                <div className="w-6 h-6">
                  <TrashIcon />
                </div>
              </div>
            </div>
            {openRemoveRecordModal && (
              <RemoveRecordModal 
              setOpenRemoveRecordModal={setOpenRemoveRecordModal} 
              handleRemoveClick={handleRemoveClick}/>
            )}
          </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  )  
}

export default TotalRecordsPage;


// {
//   totalRecords.map((record) => (
//   <RecordsItem
//     key={record.recordSeq}
//     recordSeq={record.recordSeq}
//     title={record.title}
//     recordingTime={record.recordingTime}
//     preview={record.preview}
//     regDtm={record.regDtm}
//     modDtm={record.modDtm}
//     onRemove={() => handleRemoveRecord(record.recordSeq)}
//     onChangeTitle={(newTitle) => handleChangeTitle(record.recordSeq, newTitle)}
//   />
// ))}