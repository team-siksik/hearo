import React, { useEffect, useState } from "react";
import CommunicationStart from "../components/Communication/CommunicationStart";
import CommunicationComp from "../components/Communication/CommunicationComp";

/**
 *
 * 대화 화면
 * @returns
 */
function Communication() {
  const [comp, setComp] = useState("start_comm");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setComp("comm");
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      {comp === "start_comm" ? (
        <CommunicationStart />
      ) : comp === "comm" ? (
        <CommunicationComp />
      ) : null}
    </div>
  );
}

export default Communication;
