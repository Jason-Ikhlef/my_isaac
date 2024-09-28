import Pooter from "../pooter.js";
import Doors from "../doors.js";
import Floor from "../floor.js";
import Borders from "../borders.js";

export default class BossRoom extends Phaser.Scene {
    constructor() {
        super("BossRoom");

        let midWidth = window.innerWidth / 2;
        let midHeight = window.innerHeight / 2;
        this.rockPositions = [
            { x: midWidth + 135, y: midHeight + 150 },
            { x: midWidth - 135, y: midHeight + 150 },
            { x: midWidth + 270, y: midHeight + 150 },
            { x: midWidth - 270, y: midHeight + 150 },
            { x: midWidth + 405, y: midHeight + 150 },
            { x: midWidth - 405, y: midHeight + 150 },
            { x: midWidth, y: midHeight + 150 },
            { x: midWidth + 135, y: midHeight - 150 },
            { x: midWidth - 135, y: midHeight - 150 },
            { x: midWidth + 270, y: midHeight - 150 },
            { x: midWidth - 270, y: midHeight - 150 },
            { x: midWidth + 405, y: midHeight - 150 },
            { x: midWidth - 405, y: midHeight - 150 },
            { x: midWidth, y: midHeight - 150 },
            { x: midWidth + 135, y: midHeight },
            { x: midWidth - 135, y: midHeight },
            { x: midWidth + 270, y: midHeight },
            { x: midWidth - 270, y: midHeight },
            { x: midWidth + 405, y: midHeight },
            { x: midWidth - 405, y: midHeight },
            { x: midWidth, y: midHeight },
            { x: midWidth + 135, y: midHeight + 290 },
            { x: midWidth - 135, y: midHeight + 290 },
            { x: midWidth + 270, y: midHeight + 290 },
            { x: midWidth - 270, y: midHeight + 290 },
            { x: midWidth + 405, y: midHeight + 290 },
            { x: midWidth - 405, y: midHeight + 290 },
            { x: midWidth + 135, y: midHeight - 290 },
            { x: midWidth - 135, y: midHeight - 290 },
            { x: midWidth + 270, y: midHeight - 290 },
            { x: midWidth - 270, y: midHeight - 290 },
            { x: midWidth + 405, y: midHeight - 290 },
            { x: midWidth - 405, y: midHeight - 290 },
            { x: midWidth, y: midHeight - 290 },
        ];
    }

    // preload() {
    //     this.load.audio(
    //         "boss_jingle",
    //         "sounds/musics/boss/bossFightIntroJingle_01.ogg"
    //     );
    // }

    create(data) {
        // const boss_music = this.sound.add("boss_jingle");
        // boss_music.play({ volume: 0.1 });
        // setTimeout(() => {
        //     this.scene.switch("BossRoom");
        // }, 5000);
        this.setupWorld();
        this.setupPlayer(data);
        this.setupRocks(this.rockPositions);
        // this.setupEnemies();
        this.setupDoors();
    }

    update() {
        this.player.update();
        this.doorsController();
    }

    setupWorld() {
        const worldWidth = window.innerWidth;
        const worldHeight = window.innerHeight;

        new Floor(this, worldWidth, worldHeight);
        this.bordersGroup = this.physics.add.staticGroup();
        new Borders(this, worldWidth, worldHeight);
    }

    setupPlayer(data) {
        this.player = data.player;

        if (
            data.spawnPosition &&
            data.spawnPosition.x &&
            data.spawnPosition.y
        ) {
            this.player.player.setPosition(
                data.spawnPosition.x,
                data.spawnPosition.y
            );
        }

        this.physics.add.collider(this.player.player, this.bordersGroup);
    }

    setupRocks(positions) {
        this.rocksGroup = this.physics.add.group({ immovable: true });
        positions.forEach((position) => {
            let spike = this.rocksGroup.create(position.x, position.y, "rock");
            spike.setImmovable(true);
            spike.setDepth(1).setScale(1.8);
        });

        this.physics.add.collider(this.player.player, this.rocksGroup);
    }

    setupEnemies() {}

    doorsController() {
        // if (this.enemiesGroup.children.entries.length === 0) {
        this.physics.add.collider(this.player.player, this.downDoor, () => {
            this.scene
                .get("GameScene")
                .changeRoom("ThirdTopRoom", this.scene.key, {
                    x: window.innerWidth / 2,
                    y: window.innerHeight - 750,
                });
        });
        // }
    }

    setupDoors() {
        this.doors = new Doors(this);
        this.downDoor = this.doors.createDownDoor();
    }
}
