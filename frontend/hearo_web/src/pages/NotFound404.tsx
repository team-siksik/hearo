import React from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import Error from "@/assets/Icon/Error.json";

function NotFound404() {
  const navigate = useNavigate();
  return (
    <div className="relative h-screen">
      <div className="flex flex-col justify-center items-center h-full">
          <Player src={Error} loop autoplay style={{ width: "300px" }} />
          <div className="mt-6 text-3xl font-semibold">
            페이지를 찾을 수 없습니다.
          </div>
          <button
            className="mt-6 px-4 py-2 bg-red-main text-white rounded-full hover:bg-red-400 transition-all duration-200 ease-out"
            onClick={() => navigate(-1)}
            >
            뒤로가기
          </button>
      </div>
    </div>
  );
}
export default NotFound404;
