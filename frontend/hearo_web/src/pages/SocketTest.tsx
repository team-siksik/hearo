import { io } from "socket.io-client";

// TODO: Socket 통신 -> 소음 알림!! STT 화자 분리!!

// when try to connect socket -> *socket.connect()*
// const socket = io("/", { autoConnect: false }); // client domain === server domain

// const socket = io("http://ubuntu@k8a6031.p.ssafy.io:80/ws", {

function RecordPage() {
  const socket = io("http://ubuntu@k8a6031.p.ssafy.io:80", {
    autoConnect: false,
    transports: ["websocket"],
    path: "/ws/socket.io",
  }); // client domain !== server domain

  // socket이 연결이 되었으면 실행
  socket.on("connect", () => {
    console.log("connected");
  });
  // socket에 데이터가 있으면 실행
  socket.on("data", (data) => {
    console.log(data);
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("info", (data) => {
    console.log(data);
  });

  // socket 연결이 끊겼을 때 실행
  socket.on("disconnect", (reason) => {
    // ... socket.disconnect();
    console.log(reason);
  });

  function handlesocketopen() {
    socket.open();
  }
  function openRoom() {
    socket.emit("enter_room", { room_id: "1234" });
  }
  function sendMessage() {
    socket.send({ message: "hello socket" });
  }
  return (
    <div>
      <button onClick={handlesocketopen}>소켓 연결</button>
      <button onClick={openRoom}>방 파기</button>
      <button onClick={sendMessage}>메시지 보내기</button>
    </div>
  );
}

// export { socket };

export default RecordPage;
