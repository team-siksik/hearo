import { io } from "socket.io-client";

// TODO: Socket 통신 -> 소음 알림!! STT 화자 분리!!
const socketURl = "https://k8a6031.p.ssafy.io:8090/";

const socket = io(socketURl, {
  autoConnect: false,
  transports: ["websocket"],
  path: "/ws/socket.io",
}); // client domain !== server domain

// socket이 연결이 되었으면 실행
socket.on("connect", () => {
  console.log("connect");
});
// socket에 데이터가 있으면 실행
socket.on("data", () => {
  console.log();
});

// socket 연결이 끊겼을 때 실행
socket.on("disconnect", (reason) => {
  // ... socket.disconnect();
});
export default socket;

// import React, { useState } from "react";

// const Socket = () => {
//   const websocket = new WebSocket("wss://k8a6031.p.ssafy.io:7007/");

//   // 소켓을 통해 메시지가 전달된 경우, 실행되는 함수
//   websocket.onmessage = function (message) {
//     const msg = JSON.parse(message.data);
//   };

//   websocket.onclose = function (e) {
//     console.log("web socket closed");
//   };

//   websocket.onerror = function (e) {
//     console.log("websocket error");
//   };

//   websocket.onopen = function () {
//     console.log("websocket connected");
//   };
// };

// export default Socket;
