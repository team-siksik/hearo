import React, { SetStateAction, useEffect, useState } from "react";

interface PropsType {
  isRecording: boolean;
  setIsRecording: React.Dispatch<SetStateAction<boolean>>;
  stream?: MediaStream;
  setStream?: React.Dispatch<SetStateAction<MediaStream>>;
}

export default function STT({ isRecording, setIsRecording }: PropsType) {
  const [stream, setStream] = useState<MediaStream>();
  useEffect(() => {
    const getLocalStream = async () => {
      try {
        // Audio Access
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        const localAudio = new Audio();
        localAudio.srcObject = userMediaStream;
        // localAudio.autoplay = true;
        setStream(userMediaStream);
      } catch (error) {
        console.error("Error accessing microphone.", error);
      }
    };
    getLocalStream();
  }, []);

  return null;
}
