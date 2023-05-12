import React, { useState, SetStateAction } from 'react';
import { LoginModal } from './components';
import { useAuthenticate } from './redux/hooks';
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
authenticated: string | null | undefined;
component: React.ComponentType<any>;
}

// 인증이 되면 컴포넌트로 이동, 아니면 로그인 모달 띄우기
// TODO: 로그인모달 떳을 때 로그인이 정상적으로 가능한지 확인해야함 
export const PrivateRoute = (): React.ReactElement => {
  const [loginModal, setLoginModal] = useState<boolean>(false);
  
  return useAuthenticate() ? <Outlet/> : 
  <LoginModal setLoginModal={setLoginModal} />

};
