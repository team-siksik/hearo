import {
  Routes,
  Route,
  redirect,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Google, STT } from "@/apis";
import {
  ConversationPage,
  MainPage,
  TotalRecordsPage,
  FrequentPage,
  SettingsPage,
  AgainPage,
  NotFound404,
  RecordPage,
  SocketTest,
  DownloadPage,
  // TutorialPage,
} from "./pages";
import { useAppSelector } from "./redux/hooks";
import { LoginModal, ProfileModal, Navbar } from "./components";
import { useEffect, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import STTTest from "./apis/STT";
// import { PrivateRoute } from "./PrivateRoute";
import TestPage from "./pages/TestPage";
import { PrivateRoutes } from "./PrivateRoutes";

function App() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const isLogin = useAppSelector((state) => state.user.isLoggedIn);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);

  return (
    <div className="App font-Pretendard-Regular">
      <Navbar
        loginModal={loginModal}
        setLoginModal={setLoginModal}
        setOpenProfileModal={setOpenProfileModal}
      />
      <Routes>
        <Route path="/" element={<MainPage setLoginModal={setLoginModal} />} />
        <Route path="/stt" element={<STT />} />
        <Route path="/socket" element={<SocketTest />} />
        <Route path="/recordtest" element={<STTTest />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/login/oauth2/code/google" element={<Google />} />
        <Route path="*" element={<NotFound404 />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/comm" element={<ConversationPage />} />
          <Route path="/records" element={<TotalRecordsPage />} />
          <Route path="/records/:id" element={<RecordPage />} />
          <Route path="/mypage/frequent" element={<FrequentPage />} />
          <Route path="/mypage/settings" element={<SettingsPage />} />
        </Route>
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
