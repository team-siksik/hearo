import React, { SetStateAction, useCallback, useEffect, useState } from "react";

interface PropsType {
  isRecording: boolean;
  setIsRecording: React.Dispatch<SetStateAction<boolean>>;
}

export default function STT({ isRecording, setIsRecording }: PropsType) {
  const [stream, setStream] = useState<MediaStream>();
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [timer, setTimer] = useState<ReturnType<typeof setInterval>>();
  const [onRec, setOnRec] = useState(false);

  useEffect(() => {
    if (recorder !== undefined && recorder.state == "recording") {
      setTimer(setInterval(onDownload, 5000));
    }
  }, [recorder]);

  function checkTime(i: number): string {
    return i < 10 ? `0${i}` : String(i);
  }

  function getFileName() {
    const today = new Date();
    const mon = checkTime(today.getMonth() + 1);
    const day = checkTime(today.getDay() + 1);
    const h = checkTime(today.getHours());
    const m = checkTime(today.getMinutes());
    const s = checkTime(today.getSeconds());
    return String(mon + day + h + m + s);
  }

  const onRecAudio = () => {
    try {
      const mediaDevice = navigator.mediaDevices;
      mediaDevice
        .getUserMedia({
          video: false,
          audio: {
            sampleRate: 16000, // sampleRate : 쪼개는 기준
          },
        }) // user media 마이크 오디오 get
        .then((mediaStream: any) => {
          // 마이크 오디오 get하면 녹음하기
          const mediaRecorder = new MediaRecorder(mediaStream, {
            // getUserMedia()로 취득한 MediaStream을 인자로 넣어 생성잘르 호출
            audioBitsPerSecond: 16000, // audio encoding bit 전송률
            mimeType: "audio/wav",
            // MimeType: "audio/webm;codecs=opus",
          });
          mediaRecorder.start();

          mediaRecorder.ondataavailable = (e) => {
            const blob = new Blob([e.data], { type: e.data.type });
            const filename = getFileName();
            const downloadElement = window.document.createElement("a");
            downloadElement.href = window.URL.createObjectURL(blob);
            downloadElement.download = filename;
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
          };

          setStream(mediaStream);
          setRecorder(mediaRecorder);
          setOnRec(true);
        });
    } catch (err) {
      throw new Error();
    }
  };

  function uploadToServer(sounds: [Blob]) {
    const blob = new Blob(sounds, { type: sounds[0].type });

    const formData = new FormData();
    formData.append("fname", "audio.webm");
    formData.append("data", blob);

    // xhr?
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/uplaod", false);
    xhr.send(formData);
  }

  function stopCapture() {
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => track.stop());
  }

  const offRecAudio = useCallback(() => {
    recorder?.stop();
    stopCapture();
    if (timer) clearInterval(timer);
    setOnRec(false);
  }, [timer]);

  const onDownload = () => {
    recorder?.stop();
    recorder?.start();
  };

  return (
    <>
      {/* // onRec 값을 통해 녹음 중인지 아닌지를 구분하여 함수 실행 */}
      <button onClick={onRec ? onRecAudio : offRecAudio}>녹음</button>
    </>
  );
}
