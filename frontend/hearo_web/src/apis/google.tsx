import React from "react";

function Google() {
  const parsedHash = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = parsedHash.get("access_token");
  //TODO: access Token을 백으로 넘겨줌
  return <div></div>;
}

export default Google;
