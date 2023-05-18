import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Layout, Button } from "@/components";
import { Player } from "@lottiefiles/react-lottie-player";
import OfficeMen from "@/assets/Icon/OfficeMen.json";

interface PropsType {}
function DownloadPage() {
  return (
    <div className="flex h-[100vh]">
      <div className="m-auto">
        <div>
          <Player
            src={OfficeMen}
            loop
            autoplay
            style={{ width: "100%", height: "300px" }}
          />
          <div className="mt-1 px-1">
            <div className="text-blue-main">
              <p className="text-l mb-1 font-semibold">소리를 잇는 다리,</p>
              <p>
                <span className="mr-1 font-chewy text-5xl font-extrabold">
                  HEARO
                </span>
                <span className="text-xl">Office</span>
              </p>
            </div>
            <div className="mt-6">
              <p>회사에서, 학교에서, 회의가 필요한 어디에서나</p>
              <p>
                <span className="text-blue-main">Hearo Office</span>를 통해
                회의에 편하게 참여하세요!
              </p>
            </div>
            <p className="mt-6 text-sm">안드로이드 환경에서 사용 가능합니다.</p>
          </div>
          <div className="my-7">
            <a href="public/hearo_05_17_01_release.apk" download>
              <Button type="blueTextBtn">다운로드</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadPage;
