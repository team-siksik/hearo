import { TrashIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import { RemoveRecordModal } from "@/components";
import React, { useState } from "react";
import {RecordpageSideBar,
} from "@/components";

interface RecordPageProps {
  title?: string;
  date: string;
  description: string;
  onChangeTitle: (title: string) => void;
}


function RecordPage({ onChangeTitle }: RecordPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { title: string, date: string, description : string}
  const { title: initialTitle, date, description } = state;

  const [title, setTitle] = useState(initialTitle);
  const [openRemoveRecordModal, setOpenRemoveRecordModal] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');

  const [newTitle, setNewTitle] = useState<string>(title || "");
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const newTitle = e.target.value;
    setTitle(newTitle);
    setUpdatedTitle(newTitle);
    console.log(newTitle)
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onChangeTitle(newTitle);
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
              <div className="flex flex-row items-center">
                <div className="font-bold text-3xl text-gray-600 rounded-lg self-center">
                  <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="제목을 입력해주세요"
                    className="p-2 w-full hover:cursor-pointer hover:outline rounded-lg"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    />
                  </form>
                </div>  
                {(isHovered || isFocused) ? (
                  <div className="ml-4 w-10 h-10 self-center text-gray-600">
                    <PencilSquareIcon/>
                  </div>
                ) : title ? null : (
                  <div className="ml-4 w-10 h-10 self-center text-gray-600">
                    <PencilSquareIcon/>
                  </div>
                )}
              </div>
              <div className="flex flex-row  mr-4">
                  <div className="m-4 p-1">
                    <button
                      className="w-20 py-2 bg-red-main text-white rounded-full hover:bg-red-400 transition-all duration-200 ease-out"
                      onClick={moveToRecords}
                      >
                      Back
                    </button>
                  </div>
                  <div
                    className="mx-2 my-4 font-semibold text-red-main rounded-full bg-red-50 w-12 h-12 hover:bg-red-300 hover:shadow-sm transition-all duration-200 ease-out flex justify-center items-center"
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