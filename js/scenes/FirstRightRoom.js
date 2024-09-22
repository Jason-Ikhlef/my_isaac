import Player from "../player.js";
import { createAnimations } from "../animations.js";
import Pooter from "../pooter.js";
import Doors from "../doors.js";
import Floor from "../floor.js";
import Borders from "../borders.js";

export default class FirstRightRoom extends Phaser.Scene {
    constructor() {
        super("FirstRightRoom");

        this.keyZ = null;
        this.keyS = null;
        this.keyQ = null;
        this.keyD = null;
        this.lastDirection = "down";

        this.spikesGroup, (this.enemiesGroup = null);

        this.spikePositions = [
            { x: 1380, y: 235 },
            { x: 565, y: 665 },
        ];
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
        this.leftDoor = this.doors.createLeftDoor();
        this.rightDoor = this.doors.createRightDoor();

        this.player = new Player(this);

        this.physics.add.collider(this.player.player, this.bordersGroup);

        createAnimations(this);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.spikesGroup = this.physics.add.group({ immovable: true });
        this.createSpikes(this.spikePositions);

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

        this.enemiesGroup = this.physics.add.group();
        let pooter = new Pooter(this, 500, 300);
        this.enemiesGroup.add(pooter.sprite);
    }

    update() {
        this.player.update();

        if (this.enemiesGroup.children.entries.length == 0) {
            this.physics.add.collider(this.player.player, this.leftDoor, () => {
                this.scene.switch("SpawnRoom");
            });
            this.physics.add.collider(
                this.player.player,
                this.rightDoor,
                () => {
                    this.scene.switch("SecondRightRoom");
                }
            );
        }
    }

    createSpikes(positions) {
        positions.forEach((position) => {
            let spike = this.spikesGroup.create(
                position.x,
                position.y,
                "spikes"
            );
            spike.setImmovable(true);
            spike.body.moves = false;
            spike.setDepth(1);
            spike.setScale(1.8);
        });
    }
}
