import React from "react";

/**
 * 상단에 위에서 아래로 내려오는 alert입니다.
 * 연결 오류나 기타 에러는 해당 alert로 통일하겠습니다.
 */

interface PropsType {
  children: React.ReactNode;
}
function Alert({ children }: PropsType) {
  return <div> {children} </div>;
}

export default Alert;
