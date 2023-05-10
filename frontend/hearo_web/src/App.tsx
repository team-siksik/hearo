import { Routes, Route } from "react-router-dom";
import { Google, STT, socket } from "@/apis";
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
  SocketPage,
  // TutorialPage,
} from "./pages";
import { useAppSelector } from "./redux/hooks";
import { LoginModal, Navbar } from "./components";
import { useState } from "react";
import STTTest from "./pages/STTTest";

function App() {
  const user = useAppSelector((state) => state.user);
  const [loginModal, setLoginModal] = useState<boolean>(false);

  return (
    <div className="App">
      <Navbar setLoginModal={setLoginModal} />
      <Routes>
        <Route path="/" element={<MainPage setLoginModal={setLoginModal} />} />
        <Route path="/test" element={<STT />} />
        <Route path="/socket" element={<SocketPage />} />
        <Route path="/stt" element={<STTTest />} />
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
    </div>
  );
}

export default App;
