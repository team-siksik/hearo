import React, { useState, SetStateAction } from "react";
import { LoginModal } from "./components";
import { useAppSelector, useAuthenticate } from "./redux/hooks";
import { Navigate, Outlet } from "react-router-dom";

// 인증이 되면 컴포넌트로 이동, 아니면 로그인 모달 띄우기
// TODO: 로그인모달 떳을 때 로그인이 정상적으로 가능한지 확인해야함
export const PrivateRoutes = () => {
  const isLogin = sessionStorage.getItem("accessToken") ? true : false;

  return isLogin ? <Outlet /> : <Navigate to="/" />;
};
