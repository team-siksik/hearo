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

export const decodeUnicode = (unicodeString: string): string => {
  const r = /\\u([\d\w]{4})/gi;
  unicodeString = unicodeString.replace(r, function (match, grp) {
    return String.fromCharCode(parseInt(grp, 16));
  });
  return unescape(unicodeString);
};
