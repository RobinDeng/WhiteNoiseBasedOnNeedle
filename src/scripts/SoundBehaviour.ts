import { Behaviour, serializable } from "@needle-tools/engine";
import SoundManager from "./SoundManager";

class SoundBehaviour extends Behaviour {
    isPlaying:boolean=true;
    bufferSourceNode?: AudioBufferSourceNode;
    pannerNode?: PannerNode|null = null;
    audioCtx: AudioContext|null = null;
    audioBuffer: AudioBuffer|null = null;
    convolver1:ConvolverNode|null = null
    convolver2:ConvolverNode|null = null
    convolver3:ConvolverNode|null = null
    mainGainNode: GainNode|null = null;
    fadeConvolverGainNode1:GainNode|null = null;
    fadeConvolverGainNode2:GainNode|null = null;
    fadeConvolverGainNode3:GainNode|null = null;

    audioPanner: PannerNode|null = null;
    get soundManager(): SoundManager {
        return (this.context as any).soundManager;
    }
    get audioContext() {
        return this.soundManager.audioContext;
    }
    async init(audioCtx:AudioContext,soundFileUrl:string){
        //setup nodes
        this.audioCtx = audioCtx;
        const response = await fetch(soundFileUrl)
        const arrayBuffer = await response.arrayBuffer()
        this.audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer)
        this.mainGainNode = this.audioCtx.createGain()
        this.audioPanner = new PannerNode(audioCtx,{
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
        })
        
        //connect nodes
        if(!this.mainGainNode||!this.audioCtx||!this.pannerNode||!this.convolver1||!this.convolver2||!this.convolver3||!this.fadeConvolverGainNode1||!this.fadeConvolverGainNode2||!this.fadeConvolverGainNode3){
            throw new Error("Node Connection Failed")
        }else{
            this.bufferSourceNode = this.audioCtx?.createBufferSource()
            this.bufferSourceNode.buffer = this.audioBuffer
            this.bufferSourceNode.connect(this.pannerNode)
            this.pannerNode.connect(this.mainGainNode)
            this.mainGainNode.connect(this.convolver1)
            this.convolver1.connect(this.fadeConvolverGainNode1)
            this.mainGainNode.connect(this.convolver2)
            this.convolver1.connect(this.fadeConvolverGainNode2)
            this.mainGainNode.connect(this.convolver3)
            this.convolver1.connect(this.fadeConvolverGainNode3)
        }
    }

    start() {
        console.log(this);
        this.bufferSourceNode = this.audioContext.createBufferSource();
        // this.bufferSourceNode.buffer = 
        this.soundManager.addObject(this);
    }
    update() {
        if (!this.pannerNode) return;
        this.context.mainCamera?.matrix
        this.gameObject.matrix
        this.pannerNode.positionX.value;
    }
}

export default SoundBehaviour;
