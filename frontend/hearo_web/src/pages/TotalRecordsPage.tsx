import React, { useState, useEffect } from "react";
import { RecordpageSideBar, Spinner } from "@/components";
import { RecordsItem } from "@/components";
import { RecordAPI } from "@/apis/api";
import { TrashIcon } from "@heroicons/react/24/solid";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import { RemoveRecordModal } from "@/components";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { getRecordList } from "@/redux/modules/records";

// 전체기록페이지
interface RecordItem {
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

function TotalRecordsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [nextPage, setNextPage] = useState<number>(0);
  const [openRemoveRecordModal, setOpenRemoveRecordModal] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [totalRecords, setTotalRecords] = useState<RecordItem[]>([]);
  const recordList = useAppSelector((state) => state.record.recordList);

  useEffect(() => {
    dispatch(getRecordList(nextPage));
  }, [location, nextPage]);

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
          <div className="space-y-4 pb-12">
            {recordList.length === 0 ? (
              <div className="flex h-96 items-center justify-center font-bold">
                <Spinner loading={true} />
              </div>
            ) : (
              recordList.map((records, idx) => (
                <RecordsItem record={records} key={idx} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TotalRecordsPage;
