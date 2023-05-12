import { io } from "socket.io-client";

// TODO: Socket 통신 -> 소음 알림!! STT 화자 분리!!

const socket = io("http://k8a6031.p.ssafy.io:80", {
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
