import { Recorder } from "./recorder";

interface Config {
  server: any;
  // audioSourceId = audioSourceId;
  serverStatus: any;
  referenceHandler: any;
  contentType: any;
  interval: any;
  recorderWorkerPath: any;
  onReadyForSpeech: () => void;
  onEndOfSpeech: () => void;
  onPartialResults: (data: any) => void;
  onResults: (data: any, start: number, end: number) => void;
  onEndOfSession: () => void;
  onEvent: (e: any, data: any) => void;
  onError: (e: any, data: any) => void;
  rafCallback: (time?: any) => void;
  onServerStatus: any;
  audioSourceId: any;
  user_id?: any;
  content_id?: any;
  onWsClose?: any;
  onShareStop?: () => void;
  onEndRecording: (blob: Blob) => void;
}

interface AudioSourceConstraints {
  audio?: any;
}

// Defaults
const SERVER = "wss://stt.visionnote.io/client/ws/speech";
const SERVER_STATUS = "wss://stt.visionnote.io/client/ws/status";
const REFERENCE_HANDLER =
  "http://bark.phon.ioc.ee:82/dev/duplex-speech-api/dynamic/reference";
const CONTENT_TYPE =
  "content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1";
// Send blocks 4 x per second as recommended in the server doc.
const INTERVAL = 250;
const TAG_END_OF_SENTENCE = "EOS";
const RECORDER_WORKER_PATH = "recorderWorker.js";

// Error codes (mostly following Android error names and codes)
const ERR_NETWORK = 2;
const ERR_AUDIO = 3;
const ERR_SERVER = 4;
const ERR_CLIENT = 5;

// Event codes
const MSG_WAITING_MICROPHONE = 1;
const MSG_MEDIA_STREAM_CREATED = 2;
const MSG_INIT_RECORDER = 3;
const MSG_RECORDING = 4;
const MSG_SEND = 5;
const MSG_SEND_EMPTY = 6;
const MSG_SEND_EOS = 7;
const MSG_WEB_SOCKET = 8;
const MSG_WEB_SOCKET_OPEN = 9;
const MSG_WEB_SOCKET_CLOSE = 10;
const MSG_STOP = 11;
const MSG_SERVER_CHANGED = 12;
const MSG_AUDIOCONTEXT_RESUMED = 13;

// Server status codes
// from https://github.com/alumae/kaldi-gstreamer-server
const SERVER_STATUS_CODE = {
  0: "Success", // Usually used when recognition results are sent
  1: "No speech", // Incoming audio contained a large portion of silence or non-speech
  2: "Aborted", // Recognition was aborted for some reason
  9: "No available", // Recognizer processes are currently in use and recognition cannot be performed
};

export class Dictate {
  stream: MediaStream | null;
  getConfig: () => Config;
  init: (type: number) => Promise<boolean>;
  startListening: () => void;
  stopListening: () => void;
  cancel: () => void;
  setServer: (server: any) => void;
  setServerStatus: (serverStatus: any) => void;
  submitReference: (
    text: any,
    successCallback: any,
    errorCallback: any
  ) => void;

  constructor(cfg: any) {
    this.stream = null;
    const config: Config = cfg || {};
    config.server = config.server || SERVER;
    // config.audioSourceId = config.audioSourceId;
    config.serverStatus = config.serverStatus || SERVER_STATUS;
    config.referenceHandler = config.referenceHandler || REFERENCE_HANDLER;
    config.contentType = config.contentType || CONTENT_TYPE;
    config.interval = config.interval || INTERVAL;
    config.recorderWorkerPath =
      config.recorderWorkerPath || RECORDER_WORKER_PATH;
    config.onReadyForSpeech =
      config.onReadyForSpeech ||
      function () {
        console.log("empty");
      };
    config.onEndOfSpeech =
      config.onEndOfSpeech ||
      function () {
        console.log("empty");
      };
    config.onPartialResults =
      config.onPartialResults ||
      function (data: any) {
        console.log("empty");
      };
    config.onResults =
      config.onResults ||
      function (data: any) {
        console.log("empty");
      };
    config.onEndOfSession =
      config.onEndOfSession ||
      function () {
        console.log("empty");
      };
    config.onEvent =
      config.onEvent ||
      function (e: any, data: any) {
        console.log("empty");
      };
    config.onError =
      config.onError ||
      function (e: any, data: any) {
        console.log("empty");
      };
    config.rafCallback =
      config.rafCallback ||
      function (time) {
        console.log("empty");
      };

    // Initialized by init()
    let audioContext: any;
    let recorder: any;
    let downloader: any;
    let chunks: Blob[] = [];
    // Initialized by startListening()
    let ws: WebSocket | null;
    let intervalKey: any;
    // Initialized during construction
    let wsServerStatus: any;
    if (config.onServerStatus) {
      monitorServerStatus();
    }

    // Returns the configuration
    this.getConfig = () => {
      return config;
    };

    const setStream = (stream: MediaStream) => {
      this.stream = stream;
    };

    // Set up the recorder (incl. asking permission)
    // Initializes audioContext
    // Can be called multiple times.
    // TODO: call something on success (MSG_INIT_RECORDER is currently called)
    this.init = (type: number) => {
      return new Promise((resolve, reject) => {
        config.onEvent(
          MSG_WAITING_MICROPHONE,
          "Waiting for approval to access your microphone ..."
        );
        // 유저로부터 stream 받아오기
        try {
          // window.AudioContext = window.AudioContext || window.webkitAudioContext;
          // navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;
          audioContext = new AudioContext({ sampleRate: 16000 });

          if (navigator.mediaDevices.getUserMedia !== undefined) {
            // 마이크를 이용하여 녹음
            if (type === 0) {
              const audioSourceConstraints: AudioSourceConstraints = {};
              if (config.audioSourceId) {
                audioSourceConstraints.audio = {
                  optional: [{ sourceId: config.audioSourceId }],
                };
              } else {
                audioSourceConstraints.audio = true;
              }
              navigator.mediaDevices
                .getUserMedia(audioSourceConstraints)
                .then((stream) => {
                  setStream(stream);
                  /* use the stream */
                  const input: MediaStreamAudioSourceNode =
                    audioContext.createMediaStreamSource(stream);
                  config.onEvent(
                    MSG_MEDIA_STREAM_CREATED,
                    "Media stream created"
                  );
                  // Firefox loses the audio input stream every five seconds
                  // To fix added the input to window.source
                  // let window: Window & CustomWindow & typeof globalThis;
                  // if (document.defaultView !== null) {
                  //   window = document.defaultView;
                  //   window.source = input;
                  //   window.userSpeechAnalyser = audioContext.createAnalyser();
                  //   input.connect(window.userSpeechAnalyser);
                  // }
                  config.rafCallback();
                  recorder = new Recorder(input, {
                    workerPath: config.recorderWorkerPath,
                  });
                  config.onEvent(MSG_INIT_RECORDER, "Recorder initialized");
                  resolve(true);
                });
            } else {
              // 마이크를 통하지 않고 오디오 캡쳐
              const displayMediaConstraints = {
                video: true,
                audio: {
                  sampleRate: 16000,
                },
              };
              navigator.mediaDevices
                .getDisplayMedia(displayMediaConstraints)
                .then((stream) => {
                  stream.getVideoTracks()[0].onended = () => {
                    this.stopListening();
                    if (config.onShareStop !== undefined) config.onShareStop();
                  };
                  setStream(stream);
                  /* use the stream */
                  try {
                    const input: MediaStreamAudioSourceNode =
                      audioContext.createMediaStreamSource(stream);
                    config.onEvent(
                      MSG_MEDIA_STREAM_CREATED,
                      "Media stream created"
                    );
                    // Firefox loses the audio input stream every five seconds
                    // To fix added the input to window.source
                    // let window: Window & CustomWindow & typeof globalThis;
                    // if (document.defaultView !== null) {
                    //   window = document.defaultView;
                    //   window.source = input;
                    //   window.userSpeechAnalyser = audioContext.createAnalyser();
                    //   input.connect(window.userSpeechAnalyser);
                    // }
                    config.rafCallback();
                    recorder = new Recorder(input, {
                      workerPath: config.recorderWorkerPath,
                    });
                    config.onEvent(MSG_INIT_RECORDER, "Recorder initialized");
                    resolve(true);
                  } catch {
                    // 오디오가 공유되지 않은 경우
                    alert("오디오 공유 표시에 체크해주세요");
                    // 공유된 화면 취소
                    if (stream !== undefined) {
                      const tracks = stream.getTracks();
                      if (tracks !== undefined)
                        tracks.forEach((track) => {
                          track.stop();
                        });
                    }
                    resolve(false);
                  }
                });
            }
          } else {
            config.onError(ERR_CLIENT, "No user media support");
            resolve(false);
          }
        } catch (e) {
          // Firefox 24: TypeError: AudioContext is not a constructor
          // Set media.webaudio.enabled = true (in about:config) to fix this.
          config.onError(
            ERR_CLIENT,
            `Error initializing Web Audio browser: ${e}`
          );
          resolve(false);
        }
      });
    };

    // Start recording and transcribing
    this.startListening = () => {
      if (!recorder) {
        config.onError(ERR_AUDIO, "Recorder undefined");
        return;
      }

      if (ws) {
        this.cancel();
      }

      try {
        // recorder 생성
        const options = {
          audioBitsPerSecond: 16000,
          mimeType: "audio/webm;codecs=opus",
        };
        // 녹음된 음성을 서버로 보내기 위한 downloader 생성
        downloader = new MediaRecorder(this.stream!, options);

        chunks = [];
        downloader.ondataavailable = (e: BlobEvent) => {
          chunks.push(e.data);
        };

        downloader.onstop = (e: BlobEvent) => {
          const blob = new Blob(chunks, { type: chunks[0].type });
          chunks = [];
          config.onEndRecording(blob);
        };
        downloader.start();
        ws = createWebSocket();
        audioContext.resume().then(() => {
          config.onEvent(MSG_AUDIOCONTEXT_RESUMED, "Audio context resumed");
        });
      } catch (e) {
        config.onError(ERR_CLIENT, "No web socket support in this browser!");
      }
    };

    // Stop listening, i.e. recording and sending of new input.
    this.stopListening = () => {
      // Stop the regular sending of audio
      clearInterval(intervalKey);
      // Stop recording
      if (recorder) {
        try {
          downloader.stop();
        } catch {
          console.log("downloader error");
        }
        recorder.stop();
        config.onEvent(MSG_STOP, "Stopped recording");
        // Push the remaining audio to the server
        recorder.export16kMono((blob: Blob) => {
          socketSend(blob);
          socketSend(TAG_END_OF_SENTENCE);
          recorder.clear();
        }, "audio/x-raw");
        config.onEndOfSpeech();
        // custom : stopListening 시에 녹음 완전히 취소
        if (this.stream !== undefined) {
          const tracks = this.stream!.getTracks();
          if (tracks !== undefined) {
            tracks.forEach((track) => {
              track.stop();
            });
          }
        }
      } else {
        config.onError(ERR_AUDIO, "Recorder undefined");
      }
    };

    // Cancel everything without waiting on the server
    this.cancel = () => {
      // Stop the regular sending of audio (if present)
      clearInterval(intervalKey);
      if (recorder) {
        recorder.stop();
        recorder.clear();
        config.onEvent(MSG_STOP, "Stopped recording");
      }
      if (ws) {
        ws.close();
        ws = null;
      }
    };

    // Sets the URL of the speech server
    this.setServer = (server) => {
      config.server = server;
      config.onEvent(MSG_SERVER_CHANGED, `Server changed: ${server}`);
    };

    // Sets the URL of the speech server status server
    this.setServerStatus = (serverStatus) => {
      config.serverStatus = serverStatus;

      if (config.onServerStatus) {
        monitorServerStatus();
      }

      config.onEvent(
        MSG_SERVER_CHANGED,
        `Server status server changed: ${serverStatus}`
      );
    };

    // Sends reference text to speech server
    this.submitReference = function submitReference(
      text,
      successCallback,
      errorCallback
    ) {
      const headers = {};
      // if (config.user_id) {
      //   headers["User-Id"] = config.user_id;
      // }
      // if (config.content_id) {
      //   headers["Content-Id"] = config.content_id;
      // }
      // $.ajax({
      //   url: config.referenceHandler,
      //   type: "POST",
      //   headers: headers,
      //   data: text,
      //   dataType: "text",
      //   success: successCallback,
      //   error: errorCallback,
      // });
      fetch(config.referenceHandler, {
        method: "POST",
        body: text,
        headers,
      })
        .then(successCallback)
        .catch(errorCallback);
    };

    // Private methods
    const socketSend = (item: any) => {
      if (ws) {
        const state = ws.readyState;
        if (state === 1) {
          // If item is an audio blob
          if (item instanceof Blob) {
            if (item.size > 0) {
              ws.send(item);
              config.onEvent(
                MSG_SEND,
                `Send: blob: ${item.type}, ${item.size}`
              );
            } else {
              config.onEvent(MSG_SEND_EMPTY, `Send: blob: ${item.type}, EMPTY`);
            }
            // Otherwise it's the EOS tag (string)
          } else {
            ws.send(item);
            config.onEvent(MSG_SEND_EOS, `Send tag: ${item}`);
          }
        } else {
          config.onError(
            ERR_NETWORK,
            `WebSocket: readyState!=1: ${state} : failed to send: ${item}`
          );
        }
      } else {
        config.onError(
          ERR_CLIENT,
          `No web socket connection: failed to send: ${item}`
        );
      }
    };

    const createWebSocket = () => {
      // TODO: do we need to use a protocol?
      // let ws = new WebSocket("ws://127.0.0.1:8081", "echo-protocol");
      let url = `${config.server}?${config.contentType}`;
      if (config.user_id) {
        url += `&user-id=${config.user_id}`;
      }
      if (config.content_id) {
        url += `&content-id=${config.content_id}`;
      }
      const ws = new WebSocket(url);

      ws.onmessage = (e) => {
        const { data } = e;
        config.onEvent(MSG_WEB_SOCKET, data);
        if (data instanceof Object && !(data instanceof Blob)) {
          config.onError(
            ERR_SERVER,
            "WebSocket: onEvent: got Object that is not a Blob"
          );
        } else if (data instanceof Blob) {
          config.onError(ERR_SERVER, "WebSocket: got Blob");
        } else {
          const res = JSON.parse(data);
          if (res.status === 0) {
            if (res.result) {
              if (res.result.final) {
                config.onResults(
                  res.result.hypotheses,
                  res["segment-start"],
                  res["total-length"]
                );
              } else {
                config.onPartialResults(res.result.hypotheses);
              }
            }
          } else {
            config.onError(
              ERR_SERVER,
              `Server error: ${res.status}:${getDescription(res.status)}`
            );
          }
        }
      };

      // Start recording only if the socket becomes open
      ws.onopen = (e) => {
        intervalKey = setInterval(() => {
          recorder.export16kMono((blob: Blob) => {
            socketSend(blob);
            recorder.clear();
          }, "audio/x-raw");
        }, config.interval);
        // Start recording
        recorder.record();
        config.onReadyForSpeech();
        config.onEvent(MSG_WEB_SOCKET_OPEN, e);
      };

      // This can happen if the blob was too big
      // E.g. "Frame size of 65580 bytes exceeds maximum accepted frame size"
      // Status codes
      // http://tools.ietf.org/html/rfc6455#section-7.4.1
      // 1005:
      // 1006:
      ws.onclose = (e) => {
        const { code, reason, wasClean } = e;
        // The server closes the connection (only?)
        // when its endpointer triggers.
        console.log("web socket closed");
        config.onEndOfSession();
        config.onEvent(MSG_WEB_SOCKET_CLOSE, `${code}/${reason}/${wasClean}`);
        if (config.onWsClose !== undefined) config.onWsClose();
      };

      ws.onerror = (e: any) => {
        const { data } = e;
        config.onError(ERR_NETWORK, data);
      };

      return ws;
    };

    function monitorServerStatus() {
      if (wsServerStatus) {
        wsServerStatus.close();
      }
      wsServerStatus = new WebSocket(config.serverStatus);
      wsServerStatus.onmessage = function (evt: any) {
        config.onServerStatus(JSON.parse(evt.data));
      };
    }

    const getDescription = (code: keyof typeof SERVER_STATUS_CODE) => {
      if (code in SERVER_STATUS_CODE) {
        return SERVER_STATUS_CODE[code];
      }
      return "Unknown error";
    };
  }
}
