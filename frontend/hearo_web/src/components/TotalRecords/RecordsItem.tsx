import React, { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { RemoveRecordModal } from "@/components";
import RecordPage from "@/pages/RecordPage";

interface RecordsItemProps {
  record: {
    title: string;
    conversationSeq: number;
    isFavorite: number;
    modDtm: string;
    preview: string;
    recordSeq: number;
    recordingTime: string;
    regDtm: string;
  };
}

function RecordsItem({ record }: RecordsItemProps) {
  const [openRemoveRecordModal, setOpenRemoveRecordModal] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const moveToRecord = () => {
    navigate(`/records/${record.recordSeq}`);
  };

//   return (
//     <div className="mx-10 mt-8 p-4 rounded-2xl font-semibold text-black hover:cursor-pointer hover:bg-blue-50 transition-all duration-300 ease-out shadow-lg">
//       <div className="flex flex-row items-stretch justify-between">
//         <div onClick={moveToRecord} className="flex items-center">
//           <div
//             className="self-center mr-4 font-semibold text-blue-main rounded-full bg-blue-100 w-12 h-12 flex justify-center items-center"
//           >
//             <div className="w-6 h-6">
//               <NewspaperIcon />
//             </div>
//           </div>
//           <div>
//             {/* <div className="font-bold mb-2 cursor-pointer">
//               <RecordPage title={title} onChangeTitle={onChangeTitle} />
//             </div> */}
//             <div className="my-2 text-blue-main">{preview}</div>
//             <div className="text-sm">{title}</div>
//           </div>
//         </div>
//         <div
//           className="self-center mr-4 font-semibold text-red-main rounded-full bg-red-50 w-12 h-12 hover:bg-red-300 hover:shadow-sm transition-all duration-200 ease-out flex justify-center items-center"
//           onClick={()=> setOpenRemoveRecordModal(true)}
//         >
//           <div className="w-6 h-6">
//             <TrashIcon />
//           </div>
//         </div>
//       </div>
//       {openRemoveRecordModal && (
//         <RemoveRecordModal 
//         setOpenRemoveRecordModal={setOpenRemoveRecordModal} 
//         handleRemoveClick={handleRemoveClick}/>
//       )}
//     </div>
//   );
// }
  return (
    <div className="mx-10 mt-8 rounded-2xl p-4 font-semibold text-black shadow-lg transition-all duration-300 ease-out hover:cursor-pointer hover:bg-blue-50">
      <div className="flex flex-row items-stretch justify-between">
        <div className="flex items-center">
          <div className="mr-4 flex h-12 w-12 items-center justify-center self-center rounded-full bg-blue-100 font-semibold text-blue-main">
            <div className="h-6 w-6">
              <NewspaperIcon />
            </div>
          </div>
          <div>
            <div className="my-2 text-blue-main">
              {record.preview ? record.preview : "내용 없음"}
            </div>
            <div className="text-sm">{record.title}</div>
          </div>
        </div>
        <div className="mr-4 flex h-12 w-12 items-center justify-center self-center rounded-full bg-red-50 font-semibold text-red-main transition-all duration-200 ease-out hover:bg-red-300 hover:shadow-sm">
          <div className="h-6 w-6">
            <TrashIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordsItem;
