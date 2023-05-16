function getMediaStream() {
  console.log(navigator.getMediaStream);
  navigator.mediaDevices.getUserMedia({ audio: true }).then((mediaStream) => {
    return mediaStream;
  });
}
