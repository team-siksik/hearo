// 개별녹음 확인 페이지
import { RecordpageSideBar } from "@/components";
import React from "react";

interface RecordsItemProps {
  id : number;
  title: string;
  date: string;
  description: string;
}

function RecordPage() {
  return (
    <div>
      <RecordpageSideBar/>
      <div className="fixed mt-8 right-0 w-[82%]">
        <div>
        가즈아
        </div>
      </div>
    </div>
  )
}

export default RecordPage;