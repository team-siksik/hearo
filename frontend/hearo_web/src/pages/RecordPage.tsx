import { TrashIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import { RemoveRecordModal } from "@/components";
import React, { useState, useEffect } from "react";
import { RecordpageSideBar } from "@/components";

// 개별기록페이지
interface RecordPageProps {
  title?: string;
  onChangeTitle: (title: string) => void;
}

function RecordPage({ title, onChangeTitle }: RecordPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { date: string, description: string } | null;
  const { date = "", description = "" } = state || {};

  // const [newTitle, setTitle] = useState(initialTitle);
  const [openRemoveRecordModal, setOpenRemoveRecordModal] =
    useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [newTitle, setNewTitle] = useState<string>(title || "");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewTitle(e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    setNewTitle(title || "");
  }, [title]);

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
      <RecordpageSideBar />
      <div className="fixed right-0 mt-20 w-[82%]">
        <div className="mx-8">
          <div className="flex items-stretch justify-between ">
            <div className="flex flex-row items-center">
              <div className="self-center rounded-lg text-3xl font-bold text-gray-600">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={title}
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
              ) : title ? null : (
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
                onClick={() => setOpenRemoveRecordModal(true)}
              >
                <div className="h-6 w-6">
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
