import { serializable } from "@needle-tools/engine";
import { idle } from "./idleBehaviour";

export class PlayPauseToggle extends idle{
    @serializable()
    boundKey:string = " "
    
    start(){
        window.addEventListener("keydown", (e) => {
            if (e.key === this.boundKey) {
                this.boundKeyButtonTriggered();
                console.log(this.boundKey+" Triggered")
            }
          });
      
    }
}