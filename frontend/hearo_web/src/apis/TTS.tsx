/**
 * tts 연결 및 테스트
 */
import { useEffect, useState } from "react";

function TTS() {
  const [audio, setAudio] = useState(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  function textToSpeeach(_text: string) {
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${
      import.meta.env.VITE_GOOGLE_API_KEY
    }`;
    const data = {
      input: {
        text: _text,
      },
      voice: {
        languageCode: "ko-KR",
        name: "ko-KR-Neural2-A",
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
        // return res.audioContent; // base64
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleButtonClick() {
    textToSpeeach(text);
  }

  // function createAudioUrl(mp3Data: Buffer): string {
  //   // const blob = new Blob([mp3Data], { type: "audio/mp3" });
  //   // return URL.createObjectURL(blob);
  //   const base64Data = btoa(String.fromCharCode(...new Uint8Array(mp3Data)));
  //   return `data:audio/mp3;base64,${base64Data}`;
  // }

  // const mp3Data = await textToSpeeach("코끼리");
  // const audioUrl = createAudioUrl(mp3Data);
  // setAudio(new Audio(audioUrl));

  return (
    <div>
      <input
        className="border border-red-1"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleButtonClick}>
        Convert Text to Speech and Play
      </button>
      {playing ? (
        <audio
          src={`data:audio/mp3;base64,${audio}`}
          autoPlay
          onEnded={() => setPlaying(false)}
        />
      ) : null}
    </div>
  );
}

export default TTS;
