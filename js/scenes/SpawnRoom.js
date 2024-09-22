import Player from "../player.js";
import { createAnimations } from "../animations.js";
import Doors from "../doors.js";
import Floor from "../floor.js";
import Borders from "../borders.js";

export default class SpawnRoom extends Phaser.Scene {
    constructor() {
        super("SpawnRoom");

        this.keyZ = null;
        this.keyS = null;
        this.keyQ = null;
        this.keyD = null;
        this.lastDirection = "down";
    }

    preload() {
        this.load.spritesheet("basement", "assets/floors/Basement-Floor.png", {
            frameWidth: 233,
            frameHeight: 155,
        });

        this.load.spritesheet("basementDoor", "assets/floors/Doors.png", {
            frameWidth: 50,
            frameHeight: 33,
        });

        this.load.spritesheet("hearts", "assets/characters/hearts.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.image("spikes", "assets/floors/spikes.png");
        this.load.atlas(
            "head",
            "assets/characters/head.png",
            "assets/animations/head.json"
        );
        this.load.atlas(
            "body",
            "assets/characters/body.png",
            "assets/animations/body.json"
        );
        this.load.audio("isaac_hurt", "sounds/sfx/isaac_hurt.wav");
        this.load.audio("basement_music", "sounds/musics/dipteraSonata.ogg");
        this.load.image("tears", "assets/characters/tears.png");
        this.load.audio("tears_fire", "sounds/sfx/tears.wav");
        this.load.audio("tears_block", "sounds/sfx/tear_block.wav");
        this.load.audio("pooter_tears", "sounds/sfx/pooter_tears.wav");
        this.load.audio("pooter_die", "sounds/sfx/pooter_die.wav");
        this.load.audio("pooter_sound", "sounds/sfx/pooter_sound.wav");
        this.load.image("blood_tears", "assets/monsters/blood_tears.png");
    }

    create() {
        const worldWidth = window.innerWidth;
        const worldHeight = window.innerHeight;

        new Floor(this, worldWidth, worldHeight);

        this.bordersGroup = this.physics.add.staticGroup();

        new Borders(this, worldWidth, worldHeight);

        this.doors = new Doors(this);
        this.upDoor = this.doors.createUpDoor();
        this.rightDoor = this.doors.createRightDoor();

        this.player = new Player(this);

        this.physics.add.collider(this.player.player, this.bordersGroup);
        this.physics.add.collider(this.player.player, this.upDoor, () => {
            this.scene.switch("FirstTopRoom");
        });
        this.physics.add.collider(this.player.player, this.rightDoor, () => {
            this.scene.switch("FirstRightRoom");
        });

        createAnimations(this);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.overlap(
            this.player.player,
            this.spikesGroup,
            () => {
                if (!this.player.isInvincible) {
                    this.player.changeHealth(-1);
                    this.player.startInvincibility();
                }
            },
            null,
            this
        );

        const basement_music = this.sound.add("basement_music");
        basement_music.loop = true;
        basement_music.play({ volume: 0.1 });
    }

    update() {
        this.player.update();
    }
}
