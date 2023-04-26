import React, { useEffect, useRef, useState } from "react";
import startVoice from "../../assets/start.wav";
interface PropsType {
  setComp: React.Dispatch<React.SetStateAction<string>>;
}
function CommunicationStart({ setComp }: PropsType) {
  // TODO: audio 파일이 mainpage에 있어야 함.
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Simulate a button click when the component is rendered
    const timeout = setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    function handleAudioEnded() {
      setIsPlaying(false);
      setTimeout(() => {
        setComp("comm");
      }, 1000);
    }

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleAudioEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnded);
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <h1>히어로, 대화를 시작합니다. </h1>
    </div>
  );
}

export default CommunicationStart;
