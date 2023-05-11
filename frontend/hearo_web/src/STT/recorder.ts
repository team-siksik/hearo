// import worker_script from "./recorderWorker.js";
// const WORKER_PATH = "recorderWorker.js";
import worker_script from "./recorderWorker.js";

export class Recorder {
  context: BaseAudioContext;
  node: ScriptProcessorNode;
  configure: (cfg: any) => void;
  record: () => void;
  stop: () => void;
  clear: () => void;
  getBuffer: (cb: any) => void;
  exportWAV: (cb: any, type: any) => void;
  exportRAW: (cb: any, type: any) => void;
  export16kMono: (cb: any, type: any) => void;
  forceDownload: (blob: any, filename: any) => void;

  constructor(source: MediaStreamAudioSourceNode, cfg: any) {
    const config = cfg || {};
    const bufferLen = config.bufferLen || 4096;
    this.context = source.context;
    this.node = this.context.createScriptProcessor(bufferLen, 1, 1);
    const worker: Worker = new Worker(worker_script);
    console.log(worker);
    worker.postMessage({
      command: "init",
      config: {
        sampleRate: this.context.sampleRate,
      },
    });
    let recording = false;
    let currCallback: (b: Blob) => any; // let currCallback; need to type check;

    this.node.onaudioprocess = function (e) {
      if (!recording) return;
      worker.postMessage({
        command: "record",
        buffer: [e.inputBuffer.getChannelData(0)],
      });
    };

    this.configure = function (cfg) {
      // for (let prop in cfg){
      //   if (cfg.hasOwnProperty(prop)){
      //     config[prop] = cfg[prop];
      //   }
      // }

      //  위 코드와 아래코드 같은지 검증 필요
      Object.keys(cfg).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(cfg, key))
          config[key] = cfg[key];
      });
    };

    this.record = function () {
      recording = true;
    };

    this.stop = function () {
      recording = false;
    };

    this.clear = function () {
      worker.postMessage({ command: "clear" });
    };

    this.getBuffer = function (cb) {
      currCallback = cb || config.callback;
      worker.postMessage({ command: "getBuffer" });
    };

    this.exportWAV = function (cb, type) {
      currCallback = cb || config.callback;
      type = type || config.type || "audio/wav";
      if (!currCallback) throw new Error("Callback not set");
      worker.postMessage({
        command: "exportWAV",
        type,
      });
    };

    this.exportRAW = function (cb, type) {
      currCallback = cb || config.callback;
      type = type || config.type || "audio/raw";
      if (!currCallback) throw new Error("Callback not set");
      worker.postMessage({
        command: "exportRAW",
        type,
      });
    };

    this.export16kMono = function (cb, type) {
      currCallback = cb || config.callback;
      type = type || config.type || "audio/raw";
      if (!currCallback) throw new Error("Callback not set");
      worker.postMessage({
        command: "export16kMono",
        type,
      });
    };

    worker.onmessage = function (e) {
      const blob = e.data;
      currCallback(blob);
    };

    source.connect(this.node);
    this.node.connect(this.context.destination); // TODO: this should not be necessary (try to remove it)

    this.forceDownload = function (blob, filename) {
      const url = (window.URL || window.webkitURL).createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = filename || "output.wav";
      const click = document.createEvent("Event");
      click.initEvent("click", true, true);
      link.dispatchEvent(click);
    };
  }
}
