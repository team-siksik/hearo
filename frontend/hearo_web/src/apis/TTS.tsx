/**
 * tts 연결 및 테스트
 */
import React, { SetStateAction, useEffect, useState } from "react";

interface PropsType {
  text: string;
  setText: React.Dispatch<SetStateAction<string>>;
}

function TTS({ text, setText }: PropsType) {
  const [audio, setAudio] = useState();
  const [playing, setPlaying] = useState<boolean>(false);

  function textToSpeeach(_text: string) {
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${
      import.meta.env.VITE_GOOGLE_API_KEY
    }`;
    const data = {
      input: {
        text: _text,
      },
      //TODO: 추후에 설정을 user정보에 저장하고 값이 바뀌면 음성 바뀌게 할 수 있어야 함
      voice: {
        languageCode: "ko-KR",
        name: "ko-KR-Neural2-B",
        ssmlGender: "FEMALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    };
    const otherparam = {
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
      method: "POST",
    };
    // 사운드 생성
    fetch(url, otherparam)
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        setAudio(res.audioContent);
        setPlaying(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (text !== "") {
      textToSpeeach(text);
    }
  }, [text]);

  return (
    <div>
      {playing ? (
        <audio
          src={`data:audio/mp3;base64,${audio}`}
          autoPlay
          onEnded={() => {
            setPlaying(false);
            setText("");
          }}
        />
      ) : null}
    </div>
  );
}

export default TTS;
