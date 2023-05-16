import React, { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Button, Modal, MypageSideBar, ConvertBar } from "@/components";

interface MessageType {
  id: number;
  content: string;
  speaker: string;
}

function FavContentsPage() {
  const [id, setId] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "delete">("add");
  // const inputRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // TODO: API작업해야함
  const [contents, setContents] = useState<MessageType[]>([
    { id: 1, content: "안녕하세요 저는 청각장애인입니다.", speaker: "user" },
    { id: 2, content: "뭐 먹었어?", speaker: "user" },
    { id: 3, content: "고기 먹었어?", speaker: "user" },
    { id: 4, content: "감사합니다.", speaker: "user" },
    { id: 5, content: "스시 먹었어?", speaker: "user" },
  ]);

  // 추가 버튼
  const onAddButtonClick = () => {
    setModalType("add");
    setShowModal(true);
  };

  // 겹치지 않게 id를 기억한다
  const [idToDelete, setIdToDelete] = useState(0);
  const onDeleteButtonClick = (id: number) => {
    setModalType("delete");
    setIdToDelete(id);
    setId(id);
    setShowModal(true);
  };

  // 중복되는 내용이면 입력을 막는 함수
  const isDuplicateContent = (contentToCheck: string) => {
    return contents.some((content) => content.content === contentToCheck);
  };

  // 내용이 입력되었는지 안되었는지 확인하는 함수
  const [inputValue, setInputValue] = useState("");
  // 길어서 주의가 필요함
  const onModalSave = () => {
    if (modalType === "add") {
      if (inputValue.trim() === "") {
        setInputValue("");
        alert("내용을 입력해주세요!");
        return;
      }
      if (isDuplicateContent(inputValue)) {
        setInputValue("");
        alert("이미 추가된 내용입니다!");
        return;
      }
      const newId = contents.length + 1;
      setContents([
        ...contents,
        { id: newId, content: inputValue, speaker: "user" },
      ]);
    } else if (modalType === "delete") {
      const newContents = contents.filter((c) => c.id !== idToDelete);
      setContents(newContents);
    }
    setInputValue("");
    setShowModal(false);
  };

  const ModalOff = () => {
    setShowModal(false);
  };

  return (
    <div>
      <MypageSideBar />
      <div className="fixed right-0 mt-16 h-full w-[82%]">
        <ConvertBar />

        {/* 출력되는 내용 */}
        <div className="right-0 mx-10 mb-4 mt-28 h-[64%] overflow-y-auto rounded-2xl p-4 shadow-md shadow-gray-200">
          <div className="mt-4 space-y-6 px-6 py-2">
            {contents.map((c) => (
              <div key={c.id}>
                <div className="flex flex-row">
                  <div className="flex-grow text-gray-950">{c.content}</div>
                  <div className="flex flex-row space-x-2">
                    <button onClick={() => onDeleteButtonClick(c.id)}>
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <hr className="my-2 h-0.5 bg-black px-6 opacity-10" />
              </div>
            ))}
          </div>
        </div>
        <div className="fixed bottom-4 right-10 w-32">
          <Button onClick={onAddButtonClick} type="blueTextBtn">
            추가
          </Button>
        </div>
      </div>
      {/* 모달발생 시  */}
      {showModal && (
        <Modal open={true} cannotExit={false}>
          {modalType === "add" && (
            <div>
              <div className="mb-2 text-xl font-semibold">
                자주 쓰는 말 추가
              </div>
              <input
                type="text"
                className="w-full rounded border border-gray-200 p-2"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="m-1 mt-3 flex flex-row justify-center text-2xl font-bold">
                <button
                  onClick={ModalOff}
                  className="mt-2 border-gray-950 pl-4 pr-4"
                >
                  취소
                </button>
                <button
                  onClick={onModalSave}
                  className="mt-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-800"
                >
                  추가
                </button>
              </div>
            </div>
          )}
          {modalType === "delete" && (
            <div>
              <div className="mb-2 text-xl font-semibold">
                자주 쓰는 말 삭제
              </div>
              <div>정말로 삭제하시겠습니까?</div>
              <div className="m-1 mt-3 flex flex-row justify-center text-2xl font-bold">
                <div className="flex w-full">
                  <Button onClick={ModalOff} type="backButton">
                    취소
                  </Button>
                </div>
                <div className="flex w-full">
                  <Button onClick={onModalSave} type="deleteButton">
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default FavContentsPage;
