import React, { SetStateAction, useEffect, useState } from "react";

interface PropsType {
  stream: MediaStream;
  setStream: React.Dispatch<SetStateAction<MediaStream>>;
}

export default function MicrophoneAccess({ stream, setStream }: PropsType) {
  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        const localAudio = new Audio();
        localAudio.srcObject = userMediaStream;
        localAudio.autoplay = true;
        setStream(userMediaStream);
      } catch (error) {
        console.error("Error accessing microphone.", error);
      }
    };
    getLocalStream();
  }, []);

  return null;
}
