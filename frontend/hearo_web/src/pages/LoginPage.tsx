import React from "react";
import { GOOGLE_AUTH_URL } from "../apis/oAuthGoogle";
import Logo from "../assets/logo.gif";
import google_logo from "../assets/Google_Logo.svg";

function Login() {
  return (
    <div>
      <div>
        <img src={Logo} alt="gif" />
      </div>
      <div>
        <h2 style={{ margin: "0", color: "#E63E43" }}>Hearo</h2>
        <p style={{ margin: "4px", color: "#E63E43" }}>소시를 잇는 다리</p>
      </div>
      <div style={{ margin: "32px" }}>
        <a href={GOOGLE_AUTH_URL}>
          <button
            style={{
              backgroundColor: "white",
              borderRadius: "20",
              boxShadow: "0 -1 1 gray",
            }}
          >
            <div style={{ display: "flex" }}>
              <img
                src={google_logo}
                style={{ width: "20px", margin: "0 8px" }}
              />
              <p style={{ margin: "auto", fontSize: "12px" }}>
                구글 아이디로 로그인
              </p>
            </div>
          </button>
        </a>
      </div>
    </div>
  );
}

export default Login;
