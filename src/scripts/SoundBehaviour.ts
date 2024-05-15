import { Behaviour, serializable } from "@needle-tools/engine";
import SoundManager from "./SoundManager";

class SoundBehaviour extends Behaviour {
    isPlaying:boolean=true;
    bufferSourceNode?: AudioBufferSourceNode;
    pannerNode?: PannerNode;
    get soundManager(): SoundManager {
        return (this.context as any).soundManager;
    }
    get audioContext() {
        return this.soundManager.audioContext;
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
