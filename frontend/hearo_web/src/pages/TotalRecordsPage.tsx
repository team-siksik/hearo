import React, { useState, useEffect, useRef } from "react";
import { MypageSideBar, Spinner } from "@/components";
import { RecordsItem } from "@/components";
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
  const isLastPage = useAppSelector((state) => state.record.isLastPage);
  const [openRemoveRecordModal, setOpenRemoveRecordModal] =
    useState<boolean>(false);
  const isLoading = useAppSelector((state) => state.record.isLoading);
  const error = useAppSelector((state) => state.record.error); // error alert
  const [totalRecords, setTotalRecords] = useState<RecordItem[]>([]);
  const recordList = useAppSelector((state) => state.record.recordList); // 바뀌는지 확인
  const observerTarget = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    dispatch(getRecordList(nextPage));
  }, [nextPage]);

  function observeCallback(entries: IntersectionObserverEntry[]) {
    if (entries[0].isIntersecting && !isLastPage) {
      setNextPage((prev) => prev + 1);
    }
  }

  useEffect(() => {
    observer.current = new IntersectionObserver(observeCallback, {
      threshold: 0.1,
    });

    if (observerTarget.current && observer.current) {
      observer.current.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current && observer.current) {
        observer.current.unobserve(observerTarget.current);
      }
    };
  }, []);

  return (
    <div>
      <MypageSideBar />
      <div
        className="absolute right-0 mt-20 w-[82%] overflow-auto"
        style={{ paddingTop: "16px" }}
      >
        <div
          className="fixed bottom-0 right-0 top-20 overflow-y-scroll"
          style={{ width: "calc(82% - 1rem)" }}
        >
          <div className="space-y-4 pb-12">
            {isLoading && recordList.length === 0 ? (
              <div></div>
            ) : recordList.length === 0 ? (
              <div className="flex h-96 items-center justify-center font-bold">
                <p className="font-Pretendard-Bold">
                  저장된 대화 기록이 없습니다.
                </p>
              </div>
            ) : (
              recordList.map((records, idx) => (
                <RecordsItem record={records} key={idx} />
              ))
            )}
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center font-bold">
              <Spinner loading={true} />
            </div>
          ) : (
            <div ref={observerTarget} className="h-[10px] w-full"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TotalRecordsPage;
