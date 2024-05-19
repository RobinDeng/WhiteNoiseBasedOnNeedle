import { Behaviour, serializable } from "@needle-tools/engine";
import SoundManager from "./SoundManager";

export class SoundSource extends Behaviour{
    @serializable(URL)
    clip: string | MediaStream = "";

    @serializable()
    playOnAwake: boolean = false;

    @serializable()
    preload: boolean = false;
    audioCtx: AudioContext|null = null;

    @serializable()
    get minDistance(): number {
        return this._minDistance;
    }
    set minDistance(val: number) {
        if (this._minDistance === val) return;
        this._minDistance = val;
        // this._needUpdateSpatialDistanceSettings = true;
    }
    @serializable()
    get maxDistance(): number {
        return this._maxDistance;
    }
    set maxDistance(val: number) {
        if (this._maxDistance === val) return;
        this._maxDistance = val;
        // this._needUpdateSpatialDistanceSettings = true;
    }
    private _spatialBlend: number = 0;
    private _minDistance: number = 1;
    private _maxDistance: number = 100;

    get soundManager(): SoundManager {
        return (this.context as any).soundManager;
      }
      
    async awake(){
        this.audioCtx = this.soundManager.audioCtx;

    }

}