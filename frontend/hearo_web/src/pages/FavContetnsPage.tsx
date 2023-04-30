import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, XMarkIcon  } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components";


interface MessageType {
  id: number;
  content: string;
  speaker: string;
}


function FavContentsPage () {
  const [id, setId] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [contents, setContents] = useState<MessageType[]>([
    { id: 1, content: '안녕하세요 저는 청각장애인입니다.', speaker: 'user' },
    { id: 2, content: '뭐 먹었어?', speaker: 'user' },
    { id: 3, content: '고기 먹었어?', speaker: 'user' },
    { id: 4, content: '감사합니다.', speaker: 'user' },
    { id: 5, content: '스시 먹었어?', speaker: 'user' },
  ]);

  const mypagebarBackground = "z-10 bg-white drop-shadow";
  const navigate = useNavigate();
  const backClick = () => {
    navigate('/mypage');
  }

  const onAddButtonClick = () => {
    setModalType('add');
    setShowModal(true);
    setId(0); // reset id state
  };

  const onDeleteButtonClick = (id: number) => {
    setModalType('delete');
    setId(id);
    setShowModal(true);
    console.log('삭제 안되나?')
  };
  
  const onModalSave = (content: string) => {
    if (modalType === 'add') {
      const newId = contents.length + 1;
      setContents([...contents, { id: newId, content: content, speaker: 'user' }]);
    } else if (modalType === 'delete') {
      const newContents = contents.filter(c => c.id !== id);
      setContents(newContents);
    }
    setShowModal(false);
    console.log('왜 저장이 안되니~~')
  };


  return (
    <div>
      {/* 상단footer */}
      <div className={`${mypagebarBackground} flex flex-row p-2.5 w-full h-full`}>
        <div>
          <ArrowLeftIcon className="w-8 h-8" onClick={backClick} />
        </div>
        <div className="pl-[25%] font-bold text-3xl ">
          자주 쓰는 말
        </div>
        <div className="ml-auto flex flex-row space-x-2">
          <button onClick={onAddButtonClick} className="flex flex-row pt-1 text-red-main font-bold text-lg w-8 h-8">
            추가
          </button>
        </div>
      </div>
  
      {/* 출력되는 내용 */}
      <div className="px-4 py-2 space-y-4">
        {contents.map((c) => (
          <div key={c.id} className="flex flex-row">
            <div className="flex-grow text-gray-500">{c.content}</div>
            <div className="flex flex-row space-x-2">
              <button onClick={() => onDeleteButtonClick(c.id)}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
          
      {/* 모달발생 시  */}
      {showModal && (
        <Modal open={true} cannotExit={false}>
          {modalType === 'add' && (
           <div>
           <div className="mb-2 text-xl font-semibold">자주 쓰는 말 추가</div>
           <input type="text" className="w-full border border-gray-200 p-2 rounded" autoFocus />
           <button onClick={onModalSave} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
             추가
           </button>
          </div>
          )}
          {modalType === 'delete' && (
            <div>
              <div className="mb-2 text-xl font-semibold">자주 쓰는 말 삭제</div>
              <div>정말로 삭제하시겠습니까?</div>
              <div className="flex flex-row text-2xl justify-center m-1 mt-3 font-bold">
                <div className="pl-4 pr-4">
                  취소 
                </div>
                <div onClick={() => onDeleteButtonClick(id)} className="text-red-main pl-4 pr-4"> 
                  삭제
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