import { AudioClipModel, Behaviour, serializable } from "@needle-tools/engine";
import SoundManager from "./SoundManager";

declare type AudioClip = string;

class SoundBehaviour extends Behaviour {
  @serializable(URL)
  soundFileUrl?: AudioClip;
  bufferSourceNode: AudioBufferSourceNode | null = null;
  pannerNode: PannerNode | null = null;
  audioCtx: AudioContext | null = null;
  audioBuffer: AudioBuffer | null = null;
  gain_AsConvolver0: GainNode | null = null;
  convolver1: ConvolverNode | null = null;
  convolver2: ConvolverNode | null = null;
  convolver3: ConvolverNode | null = null;
  mainGainNode: GainNode | null = null;
  fadeConvolverGainNode1: GainNode | null = null;
  fadeConvolverGainNode2: GainNode | null = null;
  fadeConvolverGainNode3: GainNode | null = null;
  audioPanner: PannerNode | null = null;
  isPlaying: boolean = false;

  get soundManager(): SoundManager {
    return (this.context as any).soundManager;
  }
  get audioContext() {
    return this.soundManager.audioContext;
  }
  async init(audioCtx: AudioContext, 
    soundFileUrl: string
) {
    //setup nodes
    this.audioCtx = audioCtx;
    const response = await fetch(soundFileUrl);
    const arrayBuffer = await response.arrayBuffer();
    this.audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
    this.mainGainNode = this.audioCtx.createGain();
    this.fadeConvolverGainNode1 = this.audioCtx.createGain();
    this.fadeConvolverGainNode2 = this.audioCtx.createGain();
    this.fadeConvolverGainNode3 = this.audioCtx.createGain();
    this.audioPanner = new PannerNode(audioCtx, {
      panningModel: "HRTF",
      distanceModel: "inverse",
      refDistance: 1,
      maxDistance: 1000,
      rolloffFactor: 1,
      coneInnerAngle: 360,
      coneOuterAngle: 0,
      coneOuterGain: 0,
      orientationX: 1,
      orientationY: 0,
      orientationZ: 0,
      positionX: this.gameObject.worldPosition.x,
      positionY: this.gameObject.worldPosition.y,
      positionZ: this.gameObject.worldPosition.z,
    });
    //set up ConvolverNodes
    this.gain_AsConvolver0 = this.audioCtx.createGain();
    this.fadeConvolverGainNode1.gain.setValueAtTime(
      0,
      this.audioCtx.currentTime
    );
    this.fadeConvolverGainNode2.gain.setValueAtTime(
      0,
      this.audioCtx.currentTime
    );
    this.fadeConvolverGainNode3.gain.setValueAtTime(
      0,
      this.audioCtx.currentTime
    );
    this.convolver1 = this.audioCtx.createConvolver();
    const convolver1Response = await fetch("../public/IRs/0_8s_small.mp3");
    const arrayBuffer1 = await convolver1Response.arrayBuffer();
    this.convolver1.buffer = await this.audioCtx.decodeAudioData(arrayBuffer1);
    this.convolver2 = this.audioCtx.createConvolver();
    const convolver2Response = await fetch("../public/IRs/2_0s_medium.mp3");
    const arrayBuffer2 = await convolver2Response.arrayBuffer();
    this.convolver2.buffer = await this.audioCtx.decodeAudioData(arrayBuffer2);
    this.convolver3 = this.audioCtx.createConvolver();
    const convolver3Response = await fetch("../public/IRs/2_9s_large.wav");
    const arrayBuffer3 = await convolver3Response.arrayBuffer();
    this.convolver3.buffer = await this.audioCtx.decodeAudioData(arrayBuffer3);

    //connect nodes
    if (!this.mainGainNode || !this.audioCtx || !this.pannerNode) {
      throw new Error("Node Connection Failed");
    } else if (
      !this.convolver1 ||
      !this.convolver2 ||
      !this.convolver3 ||
      !this.fadeConvolverGainNode1 ||
      !this.fadeConvolverGainNode2 ||
      !this.fadeConvolverGainNode3 ||
      !this.gain_AsConvolver0
    ) {
      throw new Error("Convolver Setup Failed");
    } else {
      this.bufferSourceNode = this.audioCtx?.createBufferSource();
      this.bufferSourceNode.buffer = this.audioBuffer;
      this.bufferSourceNode.connect(this.pannerNode);
      this.pannerNode.connect(this.mainGainNode);
      this.mainGainNode.connect(this.gain_AsConvolver0);
      this.mainGainNode.connect(this.convolver1);
      this.convolver1.connect(this.fadeConvolverGainNode1);
      this.mainGainNode.connect(this.convolver2);
      this.convolver1.connect(this.fadeConvolverGainNode2);
      this.mainGainNode.connect(this.convolver3);
      this.convolver1.connect(this.fadeConvolverGainNode3);
      this.gain_AsConvolver0.connect(this.audioCtx.destination);
      this.fadeConvolverGainNode1.connect(this.audioCtx.destination);
      this.fadeConvolverGainNode2.connect(this.audioCtx.destination);
      this.fadeConvolverGainNode3.connect(this.audioCtx.destination);
    }
  }
  onEnable() {}
  start() {
    console.log(this);
    const audioCtx = new AudioContext();
    this.init(audioCtx, 
        this.soundFileUrl as string
    );
    this.bufferSourceNode = this.audioContext.createBufferSource();
    // this.bufferSourceNode.buffer =
    this.soundManager.addObject(this);
    window.addEventListener("keydown", (e) => {
      if (e.key === "0") {
          this.test__0ButtonTriggered();
          console.log(" '0' Button Triggered")
      }
    });
  }
  update() {
    if (!this.pannerNode) return;
    this.context.mainCamera?.matrix;
    this.gameObject.matrix;
    this.pannerNode.positionX.value;
  }
  test__0ButtonTriggered() {
    if(this.isPlaying===false){
    this.bufferSourceNode?.start();
    console.log("Playing");
    this.isPlaying=true
  }if(this.isPlaying===true){
    this.bufferSourceNode?.stop();
    console.log("Playing");
    this.isPlaying=false
  }
  
}
}

export default SoundBehaviour;
