import { TrashIcon } from "@heroicons/react/24/solid";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import { RemoveRecordModal } from "@/components";
import React, { useState } from "react";
import {RecordpageSideBar,
} from "@/components";

interface LocationState {
  title: string;
  date: string;
  description: string;
}

function RecordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { title: string, date: string, description : string}
  const { title: initialTitle, date, description } = state;

  const [title, setTitle] = useState(initialTitle);
  const [openRemoveRecordModal, setOpenRemoveRecordModal] = useState<boolean>(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };


  const moveToRecords = () => {
    navigate(`/records`);
  };

  const handleRemoveClick = () => {
    setOpenRemoveRecordModal(false);
    // Record 삭제 코드 추가
  };

  return (
    <div>
      <RecordpageSideBar/>
        <div className="fixed right-0 mt-20 w-[82%]">
          <div className="mx-8"> 
            <div className="flex justify-between items-stretch ">
                <div className="font-bold text-3xl text-gray-600 rounded-lg self-center">
                  <input
                    type="text" 
                    value={title}
                    onChange={handleTitleChange}
                    className="
                      w-full
                      hover:cursor-pointer 
                      border-none 
                      border-black
                      hover:border-blue-main 
                      hover:shadow-blue-main 
                      text-black
                      "
                  />
                </div>
                <div className="flex flex-row  mr-4">
                    <div className="m-4 pl-0 p-1">
                      <button
                        className="px-4 py-2 bg-red-main text-white rounded-full hover:bg-red-400 transition-all duration-200 ease-out"
                        onClick={moveToRecords}
                        >
                        Back
                      </button>
                    </div>
                    <div
                      className="m-4 font-semibold text-red-main rounded-full bg-red-50 w-12 h-12 hover:bg-red-300 hover:shadow-sm transition-all duration-200 ease-out flex justify-center items-center"
                      onClick={() => setOpenRemoveRecordModal(true)}>
                      <div className="w-6 h-6">
                        <TrashIcon />
                      </div>
                    </div>
                </div>
            </div>
            <div className="text-sm">{date}</div>
            <div className="my-2">{description}</div>
          </div>  
          {openRemoveRecordModal && (
            <RemoveRecordModal
            setOpenRemoveRecordModal={setOpenRemoveRecordModal}
            handleRemoveClick={handleRemoveClick}
            />
            )}
      </div>
    </div>
  );
}

export default RecordPage;