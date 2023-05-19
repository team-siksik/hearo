import React from "react";
import { Button } from "@/components";
import { Player } from "@lottiefiles/react-lottie-player";
import OfficeMen from "@/assets/Icon/OfficeMen.json";
import bactrianCamel from "@/assets/Icon/bactrianCamel.json";

interface PropsType {}
function DownloadPage() {
  return (
    <div className="flex h-[100vh]">
      <div className="m-auto">
        <div style={{ marginTop: "8rem", marginBottom: "8rem" }}>
          <Player
            src={bactrianCamel}
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
              </p>
            </div>
            <div className="mt-6">
              <p>대화가 필요한 어디에서나</p>
              <p>
                <span className="font-semibold text-blue-main">Hearo</span>과
                함께 편하게 대화하세요!
              </p>
            </div>
            <p className="mt-6 text-sm">안드로이드 환경에서 사용 가능합니다.</p>
          </div>
          <div className="my-7">
            <a href="public/HearoApp.apk" download>
              <Button type="blueTextBtn">Hearo 다운로드</Button>
            </a>
          </div>
        </div>

        <div style={{ marginTop: "8rem", marginBottom: "8rem" }}>
          <Player
            src={OfficeMen}
            loop
            autoplay
            style={{ width: "100%", height: "300px" }}
          />
          <div className="mt-1 px-1">
            <div className="text-blue-main">
              <p className="text-l mb-1 font-semibold">회사에서도 편리하게,</p>
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
                <span className="font-semibold text-blue-main">
                  Hearo Office
                </span>
                를 통해 회의에 편하게 참여하세요!
              </p>
            </div>
            <p className="mt-6 text-sm">PC 환경에서 접속해 주세요.</p>
          </div>
          <div className="my-7">
            <a href="https://k8a603.p.ssafy.io/" download>
              <Button type="blueTextBtn">Hearo Office 바로가기</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadPage;
