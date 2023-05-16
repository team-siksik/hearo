onmessage = (e) => {
  postMessage(e.data.message + " is ready");

  const ws = new WebSocket("ws://k8a6031.p.ssafy.io:7007/");

  ws.onmessage = (event) => {
    const message = event.data;
    postMessage(`Received: ${message}`);
  };

  ws.onopen = () => {
    console.log("receiveAudio opened");
  };

  ws.onclose = () => {
    console.log("receiveAudio closed");
  };

  ws.onerror = (error) => {
    console.log("receiveAudio error: " + error.message);
  };
};
