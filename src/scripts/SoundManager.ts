import SoundBehaviour from "./SoundBehaviour";

class SoundManager {
    audioContext = new AudioContext();
    masterGain = this.audioContext.createGain();
    convolver = this.audioContext.createConvolver();
    behaviours: SoundBehaviour[] = [];
    constructor() {
        this.masterGain.connect(this.convolver);
        this.convolver.connect(this.audioContext.destination);
    }
    addObject(behaviour: SoundBehaviour) {
        this.behaviours.push(behaviour);
        if (behaviour.bufferSourceNode) {
            behaviour.bufferSourceNode.connect(this.masterGain);
        }
    }
}

export default SoundManager;
