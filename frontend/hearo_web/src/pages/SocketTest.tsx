import { Layout } from "@/components";
import { useEffect } from "react";
import { io } from "socket.io-client";

// TODO: Socket 통신 -> 소음 알림!! STT 화자 분리!!

// when try to connect socket -> *socket.connect()*
// const socket = io("/", { autoConnect: false }); // client domain === server domain

// const socket = io("http://ubuntu@k8a6031.p.ssafy.io:80/ws", {
const socketURl = "https://k8a6031.p.ssafy.io:8090/ws/";
// const socketURl = "https://k8a6031.p.ssafy.io:8090/";

function SocketTest() {
  const socket = io(socketURl, {
    autoConnect: false,
    transports: ["websocket"],
    path: "/ws/socket.io",
  }); // client domain !== server domain
  useEffect(() => {
    console.log(socket);
  }, []);
  // socket이 연결이 되었으면 실행
  socket.on("connect", () => {
    console.log(socket);
    console.log("connected");
  });

  // socket에 info data가 있으면 실행
  socket.on("info", (data) => {
    console.log(socket);
    console.log(data);
  });

  // socket에 데이터가 있으면 실행
  socket.on("data", (data) => {
    console.log(socket);
    console.log(data);
  });

  socket.on("connect_error", (err) => {
    console.log(socket);
    console.log(`connect_error due to ${err.message}`);
  });

  // socket 연결이 끊겼을 때 실행
  socket.on("disconnect", (reason) => {
    // ... socket.disconnect();
    console.log(socket);
    console.log(reason);
  });

  function handlesocketopen() {
    console.log("socket open request");
    console.log(socket);
    socket.open();
  }
  function handlesocketclose() {
    console.log("socket close request");
    console.log(socket);
    socket.close();
  }

  function openRoom() {
    console.log("socket open room request");
    console.log(socket);
    socket.emit("enter_room", { room_id: "1234" });
  }
  function sendMessage() {
    console.log("socket send msg request");
    console.log(socket);
    socket.emit("audio", { audio: "1234" });
  }
  return (
    <Layout>
      <div className="m-40 flex flex-row gap-4">
        <button
          className="border-spacing-3 border border-blue-main"
          onClick={handlesocketopen}
        >
          소켓 연결
        </button>
        <button
          className="border-spacing-3 border border-blue-main"
          onClick={handlesocketclose}
        >
          소켓 연결 끊기
        </button>
        <button
          className="border-spacing-3 border border-blue-main"
          onClick={openRoom}
        >
          방 파기
        </button>
        <button
          className="border-spacing-3 border border-blue-main"
          onClick={sendMessage}
        >
          메시지 보내기
        </button>
      </div>
    </Layout>
  );
}

// export { socket };

export default SocketTest;
