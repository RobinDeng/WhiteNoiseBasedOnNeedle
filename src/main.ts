import SoundManager from "./scripts/SoundManager";

(async () => {
    const { onStart, onInitialized } = await import("@needle-tools/engine") /* async import of needle engine */;

    onInitialized((context) => {
        console.log(context);
        const scene = context.scene;
        const soundManager = new SoundManager();
        (window as any).soundManager = soundManager;
        (context as any).soundManager = soundManager;
    });
})()
