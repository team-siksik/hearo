import React from "react";

function MeetingSidebar() {
  return (
    <div className="fixed left-0 h-full w-[18%] border border-slate-200 bg-slate-50">
      <div className="flex h-full flex-col text-lg font-semibold">
        <div className="flex h-[5%] w-full items-center border-b border-slate-200">
          설정을
        </div>
        <div className="flex h-[5%] w-full items-center border-b border-slate-200">
          어떤 것을{" "}
        </div>
        <div className="flex h-[5%] w-full items-center border-b border-slate-200">
          넣을까요?
        </div>
      </div>
    </div>
  );
}

export default MeetingSidebar;
