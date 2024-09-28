export default class BossEntry extends Phaser.Scene {
    constructor() {
        super("BossEntry");
    }

    preload() {
        this.load.audio(
            "boss_jingle",
            "sounds/musics/boss/bossFightIntroJingle_01.ogg"
        );
    }

    create() {
        const boss_music = this.sound.add("boss_jingle");
        boss_music.play({ volume: 0.1 });
        setTimeout(() => {
            this.scene.switch("BossRoom");
        }, 5000);
    }

    update() {}
}
