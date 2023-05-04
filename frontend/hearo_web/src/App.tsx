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
} from "./pages";
import { useAppSelector } from "./redux/hooks";

function App() {
  const user = useAppSelector((state) => state.user);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/login"
          element={user === null ? <LoginPage /> : <MainPage />}
        />
        <Route path="/comm" element={<ConversationPage />} />
        <Route path="/recognize" element={<RecognizePage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/favcontents" element={<FavContentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/again" element={<AgainPage />} />
        <Route path="/login/oauth2/code/google" element={<Google />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </div>
  );
}

export default App;
