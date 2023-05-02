import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound404() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>404 NOT FOUND</h1>
      <div>
        <p>페이지를 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)}>돌아가기</button>
      </div>
    </div>
  );
}
export default NotFound404;
