import SoundBehaviour from "./SoundBehaviour";

class SoundManager {
    audioCtx = new AudioContext();
    masterGain = this.audioCtx.createGain();

    convolverSmall = this.audioCtx.createConvolver();
    convolverMedium = this.audioCtx.createConvolver();
    convolverLarge = this.audioCtx.createConvolver();
    convolverNone = this.audioCtx.createGain()

    fadeGainSmall = this.audioCtx.createGain();
    fadeGainMedium = this.audioCtx.createGain();
    fadeGainLarge= this.audioCtx.createGain();

    behaviours: SoundBehaviour[] = [];

    constructor() {
        
        this.convolverNone.gain.setValueAtTime(1,this.audioCtx.currentTime)
        this.masterGain.gain.setValueAtTime(0.6,this.audioCtx.currentTime)

        this.masterGain.connect(this.convolverSmall);
        this.masterGain.connect(this.convolverMedium);
        this.masterGain.connect(this.convolverLarge);
        this.convolverSmall.connect(this.fadeGainSmall);
        this.convolverMedium.connect(this.fadeGainMedium);
        this.convolverLarge.connect(this.fadeGainLarge);
        this.fadeGainSmall.connect(this.audioCtx.destination)
        this.fadeGainMedium.connect(this.audioCtx.destination)
        this.fadeGainLarge.connect(this.audioCtx.destination)
    }

    async setUpConvolvers(){
        const responseSmall = await fetch("../public/IRs/0_8s_small.mp3")
        const responseMeidum = await fetch("../public/IRs/2_0s_medium.mp3")
        const responseLarge = await fetch("../public/IRs/2_9s_large.wav")

        const arrayBuffer_convolverSmall = await responseSmall.arrayBuffer()
        const arrayBuffer_convolverMedium = await responseMeidum.arrayBuffer()
        const arrayBuffer_convolverLarge = await responseLarge.arrayBuffer()

        this.convolverSmall.buffer = await this.audioCtx.decodeAudioData(arrayBuffer_convolverSmall)
        this.convolverMedium.buffer = await this.audioCtx.decodeAudioData(arrayBuffer_convolverMedium)
        this.convolverLarge.buffer = await this.audioCtx.decodeAudioData(arrayBuffer_convolverLarge)
    }

    public get volume(){
        return this.masterGain.gain.value
    }
    public set volume(val:number){
        this.masterGain.gain.setValueAtTime(val,this.audioCtx.currentTime)
    }

    addObject(behaviour: SoundBehaviour) {
        this.behaviours.push(behaviour);
        if (behaviour.volumeGain) {
            behaviour.volumeGain.connect(this.masterGain);
        }
    }
}

export default SoundManager;
