import { useAppDispatch } from "@/redux/hooks";
import { googleLogin } from "@/redux/modules/user";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Google() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const parsedHash = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = parsedHash.get("access_token");
  if (accessToken) {
    const login = async () => {
      try {
        const result = await dispatch(googleLogin(accessToken));
        if (result) {
          navigate("/");
        }
      } catch (err) {
        console.log(err);
      }
    };
    // login();
  }

  //TODO: access Token을 백으로 넘겨줌

  return (
    <div className="m-auto text-center">
      <p>로그인 중...</p>
      <p>잠시만 기다려주세요</p>
    </div>
  );
}

export default Google;
