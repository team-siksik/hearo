/**
 * tts 연결 및 테스트
 */
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUserSetting } from "@/redux/modules/profile";
import React, { SetStateAction, useEffect, useRef, useState } from "react";

interface PropsType {
  text: string;
  setText: React.Dispatch<SetStateAction<string>>;
}

function TTS({ text, setText }: PropsType) {
  const dispatch = useAppDispatch();
  const voiceGender = useRef<string>("");
  const gender = useRef<string>("");
  const voicePreference = useAppSelector(
    (state) => state.profile.setting?.voiceSetting
  );

  useEffect(() => {
    dispatch(getUserSetting());
  }, []);

  useEffect(() => {
    if (voicePreference === 1) {
      voiceGender.current = "ko-KR-Neural2-A";
      gender.current = "female";
    } else {
      voiceGender.current = "ko-KR-Neural2-C";
      gender.current = "male";
    }
  }, [voicePreference]);

  const [audio, setAudio] = useState();
  const [playing, setPlaying] = useState<boolean>(false);

  function textToSpeech(_text: string) {
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${
      import.meta.env.VITE_GOOGLE_API_KEY
    }`;
    const data = {
      input: {
        text: _text,
      },
      voice: {
        languageCode: "ko-KR",
        name: voiceGender.current,
        ssmlGender: gender.current,
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
      textToSpeech(text);
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
