import { Routes, Route } from "react-router-dom";
import { Google, TTS } from "@/apis";
import {
  LoginPage,
  ConversationPage,
  MainPage,
  RecordsPage,
  MyPage,
  FavContentsPage,
  SettingsPage,
  AgainPage,
} from "./pages";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/comm" element={<ConversationPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/favcontents" element={<FavContentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/again" element={<AgainPage />} />
        <Route path="/tts" element={<TTS />} /> {/* tts test */}
        <Route path="/login/oauth2/code/google" element={<Google />} />
      </Routes>
    </div>
  );
}

export default App;
