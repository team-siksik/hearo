import React from "react";
import { GOOGLE_AUTH_URL } from "../apis/oAuthGoogle";
import Logo from "../assets/logo.gif";
import google_logo from "../assets/Google_Logo.svg";

function Login() {
  return (
    <div>
      <div>
        <img className="m-auto" src={Logo} alt="gif" />
      </div>
      <div>
        <h2 className="m-auto flex justify-center font-chewy text-5xl text-red-main">
          Hearo
        </h2>
        <p className="m-auto flex justify-center font-nanum text-2xl text-red-main">
          소리를 잇는 다리
        </p>
      </div>
      <div className="flex">
        <a className="m-auto" href={GOOGLE_AUTH_URL}>
          <button className="h-8 w-40 rounded-xl bg-white shadow-md shadow-slate-200">
            <div className="flex">
              <img className="mx-0 my-2 w-5" src={google_logo} />
              <p className="m-auto text-xs">구글 아이디로 로그인</p>
            </div>
          </button>
        </a>
      </div>
    </div>
  );
}

export default Login;
