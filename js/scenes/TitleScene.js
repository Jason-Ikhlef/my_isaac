export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: "TitleScene" });
    }

    preload() {
        this.load.image("main", "assets/ui/titlescreen/main.png");
        this.load.image("title", "assets/ui/titlescreen/title.png");
        this.load.image("cross1", "assets/ui/titlescreen/cross1.png");
        this.load.image("cross2", "assets/ui/titlescreen/cross2.png");
        this.load.atlas(
            "fly",
            "assets/ui/titlescreen/fly.png",
            "assets/animations/fly.json"
        );
        this.load.atlas(
            "start",
            "assets/ui/titlescreen/start.png",
            "assets/animations/start.json"
        );

        this.load.audio("title_music", "sounds/musics/titleScreen.ogg");
    }

    create() {
        const title_music = this.sound.add("title_music");
        title_music.loop = true;
        title_music.play({ volume: 0.1 });

        let main = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "main"
        );
        main.setOrigin(0.5, 0.5);
        main.displayWidth = this.cameras.main.width;
        main.displayHeight = this.cameras.main.height;

        let title = this.add.image(950, 200, "title");
        title.setScale(3);
        title.flipX = true;

        this.tweens.add({
            targets: title,
            y: 190,
            ease: "Sine.easeInOut",
            duration: 2000,
            yoyo: true,
            repeat: -1,
        });

        this.anims.create({
            key: "fly_anim",
            frames: this.anims.generateFrameNames("fly", {
                prefix: "fly_",
                start: 1,
                end: 2,
                zeroPad: 4,
            }),
            frameRate: 16,
            repeat: -1,
        });

        this.anims.create({
            key: "start_anim",
            frames: this.anims.generateFrameNames("start", {
                prefix: "start_",
                start: 1,
                end: 2,
                zeroPad: 4,
            }),
            frameRate: 4,
            repeat: -1,
        });

        let fly = this.add.sprite(500, 400, "fly");
        fly.setScale(2);
        fly.play("fly_anim");

        this.tweens.add({
            targets: fly,
            x: { value: 550, duration: 2000, ease: "Sine.easeInOut" },
            y: { value: 400, duration: 2000, ease: "Sine.easeInOut" },
            yoyo: true,
            repeat: -1,
        });

        let fly2 = this.add.sprite(1400, 800, "fly");
        fly2.setScale(2);
        fly2.play("fly_anim");

        this.tweens.add({
            targets: fly2,
            x: { value: 1350, duration: 2000, ease: "Sine.easeInOut" },
            y: { value: 800, duration: 2000, ease: "Sine.easeInOut" },
            yoyo: true,
            repeat: -1,
        });

        let start = this.add.sprite(950, 550, "start");
        start.setScale(3);
        start.play("start_anim");
        start.setInteractive({ useHandCursor: true });

        let cross1 = this.add.sprite(200, 800, "cross1");
        cross1.setScale(4);

        this.tweens.add({
            targets: cross1,
            scale: { from: 4, to: 4.6 },
            ease: "Sine.easeInOut",
            duration: 800,
            yoyo: true,
            repeat: -1,
        });

        let cross2 = this.add.sprite(1700, 500, "cross2");
        cross2.setScale(4);

        this.tweens.add({
            targets: cross2,
            scale: { from: 4, to: 4.4 },
            ease: "Sine.easeInOut",
            duration: 800,
            yoyo: true,
            repeat: -1,
        });

        start.on("pointerover", () => {
            this.tweens.add({
                targets: start,
                scale: 3.2,
                duration: 200,
                ease: "Sine.easeInOut",
            });
        });

        start.on("pointerout", () => {
            this.tweens.add({
                targets: start,
                scale: 3.0,
                duration: 200,
                ease: "Sine.easeInOut",
            });
        });

        start.on("pointerdown", () => {
            title_music.stop();
            this.scene.start("SpawnRoom");
        });

        this.input.keyboard.on("keydown-ENTER", () => {
            title_music.stop();
            this.scene.start("SpawnRoom");
        });

        this.input.keyboard.on("keydown-SPACE", () => {
            title_music.stop();
            this.scene.start("SpawnRoom");
        });
    }
}
