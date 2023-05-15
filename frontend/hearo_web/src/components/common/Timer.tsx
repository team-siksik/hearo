import React, { useState, useEffect, SetStateAction } from "react";
import { Input } from "@/components";
interface TimerProps {
  // props 타입 정의
  timerStarted: boolean;
  setSeconds: React.Dispatch<SetStateAction<number>>;
  seconds: number;
}

interface TimeFormat {
  minutes: string;
  seconds: string;
}
function Timer({ timerStarted, setSeconds, seconds }: TimerProps) {
  useEffect(() => {
    if (timerStarted) {
      const interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerStarted]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timeFormat: TimeFormat = {
      minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
    };
    return `${timeFormat.minutes}:${timeFormat.seconds}`;
  };

  return (
    <>
      <p className="text-xl font-bold">{formatTime(seconds)}</p>
    </>
  );
}

export default Timer;
