import { Routes, Route } from "react-router-dom";
import "./index.css";
import Google from "./apis/google";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import RecordsPage from "./pages/RecordsPage";
import CommunicationPage from "./pages/CommunicationPage";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/comm" element={<CommunicationPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/setting" element={<MyPage />} />
        <Route path="/login/oauth2/code/google" element={<Google />} />
      </Routes>
    </div>
  );
}

export default App;

