import { AudioClipModel, Behaviour, serializable } from "@needle-tools/engine";
import SoundManager from "./SoundManager";
import { Vector3 } from "three";

declare type AudioClip = string;

export class SoundBehaviour extends Behaviour {
  @serializable(URL)
  soundFileUrl: AudioClip | null = null;

  bufferSourceNode: AudioBufferSourceNode | null = null;
  audioCtx: AudioContext | null = null;
  audioBuffer: AudioBuffer | null = null;
  audioPanner: PannerNode | null = null;
  volumeGain: GainNode | null = null;
  relPositionToCam: Vector3 = new Vector3(0,0,0)

  isPlaying: boolean = false;
  volumeValue: number = 1;

  get soundManager(): SoundManager {
    return (this.context as any).soundManager;
  }
  get audioContext() {
    return this.soundManager.audioCtx;
  }
  onEnable() {}
  async awake() {
    if(!this.soundFileUrl){
      throw new Error("--------Sound File Not Selected--------")
    }else{
    console.log(this);
    this.audioCtx = this.soundManager.audioCtx;
    const response = await fetch(this.soundFileUrl);
    const arrayBuffer = await response.arrayBuffer();
    this.audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);

    this.audioPanner = new PannerNode(this.audioCtx, {
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
      positionX: this.relPositionToCam.x,
      positionY: this.relPositionToCam.y,
      positionZ: this.relPositionToCam.z,
    });

    this.volumeGain = this.audioCtx.createGain()
    this.volumeGain.gain.setValueAtTime(this.volumeValue,this.audioContext.currentTime)

    this.bufferSourceNode = this.audioContext.createBufferSource();
    this.bufferSourceNode.buffer = this.audioBuffer
    this.bufferSourceNode.connect(this.audioPanner)
    this.audioPanner.connect(this.volumeGain)

    this.soundManager.addObject(this);

    



  }
  }
  update() {
    if (!this.audioPanner) return;
    this.context.mainCamera?.matrix;
    this.gameObject.matrix;
    this.audioPanner.positionX.value;
  }
  boundKeyButtonTriggered() {
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
