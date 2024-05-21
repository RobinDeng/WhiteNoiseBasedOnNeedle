import SoundManager from "./scripts/SoundManager";

declare global {
    interface Window {
        soundManager: SoundManager
    }
}

(async () => {
    const soundManager = new SoundManager();
    window.soundManager = soundManager;
    await soundManager.setUpConvolvers();

    const { onStart, onInitialized } = await import("@needle-tools/engine") /* async import of needle engine */;

    onInitialized((context) => {
        console.log(context);
        const scene = context.scene;
    });
})()
