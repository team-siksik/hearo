import { Routes, Route } from "react-router-dom";
import { Google, socket } from "@/apis";
import {
  LoginPage,
  ConversationPage,
  MainPage,
  RecognizePage,
  MyPage,
  FavContentsPage,
  SettingsPage,
  AgainPage,
  NotFound404,
  // TutorialPage,
} from "./pages";
import { useAppSelector } from "./redux/hooks";
import { LoginModal, ProfileModal, Navbar } from "./components";
import { useState } from "react";

function App() {
  const user = useAppSelector((state) => state.user);
  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);

  return (
    <div className="App">
      <Navbar setLoginModal={setLoginModal} setOpenProfileModal={setOpenProfileModal} />
      <Routes>
        <Route path="/" element={<MainPage setLoginModal={setLoginModal} />} />
        <Route path="/comm" element={<ConversationPage />} />
        <Route path="/recognize" element={<RecognizePage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/favcontents" element={<FavContentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login/oauth2/code/google" element={<Google />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {/* 로그인 창 */}
      {loginModal && <LoginModal setLoginModal={setLoginModal} />}
      {openProfileModal && <ProfileModal setOpenProfileModal={setOpenProfileModal}/>}
    </div>
  );
}

export default App;
