import { io } from "socket.io-client";

// TODO: Socket 통신 -> 소음 알림!! STT 화자 분리!!

// when try to connect socket -> *socket.connect()*
// const socket = io("/", { autoConnect: false }); // client domain === server domain

const socket = io(
  "http://localhost:8080/"
  // { autoConnect: false }
); // client domain !== server domain

// socket이 연결이 되었으면 실행
socket.on("connect", () => {});
// socket에 데이터가 있으면 실행
socket.on("data", () => {
  console.log();
});

// socket 연결이 끊겼을 때 실행
socket.on("disconnect", (reason) => {
  // ... socket.disconnect();
});
export default socket;
