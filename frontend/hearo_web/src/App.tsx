import { Routes, Route } from "react-router-dom";
import "./App.css";
import Google from "./apis/google";
import Login from "./pages/Login";
import Communication from "./pages/Communication";

function App() {
  function login(): void {
    console.log("login");
  }
  return (
    <div className="bg-slate-600">
      <Routes>
        <Route path="/comm" element={<Communication />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/oauth2/code/google" element={<Google />} />
      </Routes>
    </div>
  );
}

export default App;
