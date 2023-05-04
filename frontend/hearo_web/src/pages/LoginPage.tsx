import React, { useEffect } from "react";
import { GOOGLE_AUTH_URL } from "../apis/oAuthGoogle";
import Logo from "@/assets/LogoGIF.gif";
import google_logo from "../assets/Google_Logo.svg";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components";
import { css } from "@emotion/react";
import { ReactComponent as CaretLeft } from "@/assets/Icon/CaretLeft.svg";

function Login() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("accessToken") ? true : false;

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="flex h-screen">
        <header className="fixed">
          <div onClick={() => navigate(-1)}>
            <CaretLeft className="h-10" />
          </div>
        </header>
        <section className="flex flex-1 flex-col items-center justify-center gap-4">
          <div>
            <img className="mx-auto my-0" src={Logo} alt="gif" />
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
              <Button type="whiteButtonFull">
                <div className="flex justify-center">
                  <img className="mx-3 w-5" src={google_logo} />
                  <p className="  text-sm ">구글 아이디로 로그인</p>
                </div>
              </Button>
            </a>
          </div>
          <div>
            <button
              className="h-10 rounded-xl border border-gray-300 px-4 text-sm  text-gray-500"
              css={css`
                width: 90vw;
              `}
              onClick={() => navigate(-1)}
            >
              다음에 하기
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default Login;
