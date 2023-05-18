import React, { useEffect, useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Button, Modal, MypageSideBar, ConvertBar } from "@/components";
import { ProfileAPI } from "@/apis/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import { FrequentType } from "@/types/types";
import { getFrequent } from "@/redux/modules/profile";

// TODO: 수정추가해야함
interface MessageType {
  id: number;
  content: string;
  speaker: string;
}

function FrequentPage() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "delete">("add");
  const [frequentData, setFrequentData] = useState<FrequentType[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFrequent());
  }, []);

  const FrequentData = useAppSelector((state) => state.profile.FrequentList);

  useEffect(() => {
    dispatch(getFrequent());
  }, []);

  useEffect(() => {
    setFrequentData(FrequentData);
  }, [FrequentData]);

  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
  }, [accessToken, navigate]);
  // 추가 버튼
  const onAddButtonClick = () => {
    setModalType("add");
    setShowModal(true);
  };

  // 겹치지 않게 id를 기억한다
  const [idToDelete, setIdToDelete] = useState(0);
  const onDeleteButtonClick = (frequentSeq: number) => {
    setModalType("delete");
    setIdToDelete(frequentSeq);
    // setId(frequentSeq);
    setShowModal(true);
  };

  const isDuplicateContent = (contentToCheck: string) => {
    return FrequentData.some(
      (FrequentData) => FrequentData.sentence === contentToCheck
    );
  };

  // 내용이 입력되었는지 안되었는지 확인하는 함수
  const [inputValue, setInputValue] = useState("");

  // 길어서 주의가 필요함
  function onModalSave() {
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
      addMyPhraseAPI();
      setInputValue("");
      setShowModal(false);
    } else if (modalType === "delete") {
      deleteMyPhraseAPI();
      setInputValue("");
      setShowModal(false);
    }
  }

  async function addMyPhraseAPI() {
    try {
      await ProfileAPI.addMyPhrase(accessToken!, inputValue);
      const response = await ProfileAPI.getMyPhraseList(accessToken!);
      setFrequentData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteMyPhraseAPI() {
    try {
      await ProfileAPI.deleteMyPhrase(accessToken!, idToDelete);
      setFrequentData((prevData) =>
        prevData.filter((data) => data.frequentSeq !== idToDelete)
      );
    } catch (error) {
      console.log(error);
    }
  }

  interface FrequentType {
    frequentSeq: number;
    sentence: string;
  }

  const handleOnKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onModalSave();
    }
  };

  const ModalOff = () => {
    setShowModal(false);
  };

  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  // 스크롤 컨테이너의 맨 밑으로 이동하는 함수
  const scrollToBottom = () => {
    const scrollableContainer = scrollableContainerRef.current;
    if (scrollableContainer) {
      scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
    }
  };
  // 출력되는 내용이 변경될 때마다 스크롤 맨 밑으로 이동
  useEffect(() => {
    scrollToBottom();
  }, [FrequentData]); // contents는 출력되는 내용의 배열

  return (
    <div>
      <MypageSideBar />
      <div className="fixed right-0 mt-16 h-full w-[82%]">
        <ConvertBar />

        {/* 출력되는 내용 */}
        <div
          ref={scrollableContainerRef}
          className="fixed right-0 mx-10 mb-4 mt-28 h-[64%] w-[76%] overflow-y-scroll rounded-2xl p-4 shadow-md shadow-gray-200"
        >
          <div className="mt-4 space-y-6 px-6 py-2">
            {frequentData.map((c) => (
              <div key={c.frequentSeq}>
                <div className="flex flex-row">
                  <div className="flex-grow text-gray-950">{c.sentence}</div>
                  <div className="flex flex-row space-x-2">
                    <button onClick={() => onDeleteButtonClick(c.frequentSeq)}>
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
        <Modal open={true} cannotExit={false} setShowModal={setShowModal}>
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
                onKeyDown={handleOnKeyDown}
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

export default FrequentPage;
