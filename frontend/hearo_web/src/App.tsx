import { Routes, Route } from "react-router-dom";
import { Google, STT } from "@/apis";
import {
  ConversationPage,
  MainPage,
  TotalRecordsPage,
  FavContentsPage,
  SettingsPage,
  AgainPage,
  NotFound404,
  RecordPage,
  SocketTest,
  // TutorialPage,
} from "./pages";
import { useAppSelector } from "./redux/hooks";
import { LoginModal, ProfileModal, Navbar } from "./components";
import { useEffect, useState } from "react";
import STTTest from "./apis/STT";
// import { PrivateRoute } from "./PrivateRoute";
import TestPage from "./pages/TestPage";

function App() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const user = localStorage.getItem("accessToken");

  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);
  // const isLoggedin = !!localStorage.getItem("accessToken");

 
  return (
    <div className="App">
      <Navbar
        loginModal={loginModal}
        setLoginModal={setLoginModal}
        setOpenProfileModal={setOpenProfileModal}
      />
      <Routes>
        <Route path="/" element={<MainPage setLoginModal={setLoginModal} />} />
        {/* <Route element={<PrivateRoute />}> */}
        <Route path="/stt" element={<STT />} />
        <Route path="/socket" element={<SocketTest />} />
        <Route path="/recordtest" element={<STTTest />} />
        <Route path="/comm" element={<ConversationPage />} />
        <Route path="/records" element={<TotalRecordsPage />} />
        <Route path="/test" element={<TestPage />} />
        {/* //FIXME: props 해결해주세요 */}
        {/* TODO: 스토어로 관리해야하는데 임시방편... */}
        <Route path="/records/:id" element={<RecordPage onChangeTitle={function (title: string): void {
          throw new Error("Function not implemented.");
        } } />} />
        <Route path="/mypage/favcontents" element={<FavContentsPage />} />
        <Route path="/mypage/settings" element={<SettingsPage />} />
        <Route path="/login/oauth2/code/google" element={<Google />} />
        <Route path="*" element={<NotFound404 />} />
        {/* </Route> */}
      </Routes>
      {/* 로그인 창 */}
      {loginModal && (
        <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />
      )}
      {/* 로그인 된 후 프로필모달창 */}
      {isLoggedIn && openProfileModal && (
        <ProfileModal setOpenProfileModal={setOpenProfileModal} />
      )}
    </div>
  );
}

export default App;
