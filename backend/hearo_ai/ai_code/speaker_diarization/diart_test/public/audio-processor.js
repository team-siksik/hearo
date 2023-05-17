class AudioProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    // 오디오 처리 작업 수행

    for (let channel = 0; channel < output.length; ++channel) {
      for (let i = 0; i < output[channel].length; ++i) {
        output[channel][i] = input[channel][i]; // 예시로 입력을 그대로 출력하는 코드
      }
    }

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
