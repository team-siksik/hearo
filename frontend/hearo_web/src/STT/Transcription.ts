function Transcription() {
  let index = 0;
  const list: any[] = [];

  function transcriptionAdd(text: string, isFinal: boolean) {
    list[index] = text;
    if (isFinal) {
      index += 1;
    }
  }

  function transcriptionAToString() {
    list.join(". ");
  }
}

export default Transcription;
