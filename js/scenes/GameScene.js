import Player from "../player.js";
import { createAnimations } from "../animations.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });

        this.keyZ = null;
        this.keyS = null;
        this.keyQ = null;
        this.keyD = null;
        this.lastDirection = 'down';

        this.spikesGroup = null;

        this.spikePositions = [
            { x: 420, y: 150 },
            { x: 462, y: 150 },
            { x: 420, y: 200 },
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

        this.load.spritesheet('hearts', 'assets/characters/hearts.png', { 
            frameWidth: 16, 
            frameHeight: 16 
        });

        this.load.image('spikes', 'assets/floors/spikes.png');
        this.load.atlas('head', 'assets/characters/head.png', 'assets/animations/head.json');
        this.load.atlas('body', 'assets/characters/body.png', 'assets/animations/body.json');
        this.load.audio('isaac_hurt', 'sounds/sfx/isaac_hurt.wav');
        this.load.audio('basement_music', 'sounds/musics/dipteraSonata.ogg');
        this.load.image('tears', 'assets/characters/tears.png');
        this.load.audio('tears_fire', 'sounds/sfx/tears.wav');
        this.load.audio('tears_block', 'sounds/sfx/tear_block.wav')

        console.log(this)
    }

    create() {
        const worldWidth = window.innerWidth;
        const worldHeight = window.innerHeight;

        this.createQuarters(worldWidth, worldHeight);

        this.createBorders(worldWidth, worldHeight);

        this.createDoors();

        this.player = new Player(this);
        
        createAnimations(this);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.spikesGroup = this.physics.add.group({ immovable: true });
        this.createSpikes(this.spikePositions);

        this.physics.add.collider(this.player.player, this.borderTop);
        this.physics.add.collider(this.player.player, this.borderBottom);
        this.physics.add.collider(this.player.player, this.borderLeft);
        this.physics.add.collider(this.player.player, this.borderRight);

        const isaac_hurt = this.sound.add('isaac_hurt');
        this.physics.add.overlap(this.player.player, this.spikesGroup, () => {
            if (!this.player.isInvincible) {
                this.player.changeHealth(-1, isaac_hurt);
                this.player.startInvincibility();
            }
        }, null, this); 

        const basement_music = this.sound.add('basement_music', {volume: 0.5});
        basement_music.loop = true;
        basement_music.play();
    }

    update() {
        this.player.update();   
    }

    createQuarters(worldWidth, worldHeight) {
        this.add.sprite(worldWidth / 7, 0, "basement")
            .setOrigin(0, 0)
            .setDisplaySize(worldWidth / 2, worldHeight / 2);

        this.add.sprite(worldWidth / 2, 0, "basement")
            .setOrigin(0, 0)
            .setDisplaySize(worldWidth / 3, worldHeight / 2)
            .setFlipX(true);

        this.add.sprite(worldWidth / 7, worldHeight / 2, "basement")
            .setOrigin(0, 0)
            .setDisplaySize(worldWidth / 2, worldHeight / 2)
            .setFlipY(true);

        this.add.sprite(worldWidth / 2, worldHeight / 2, "basement")
            .setOrigin(0, 0)
            .setDisplaySize(worldWidth / 3, worldHeight / 2)
            .setFlipX(true)
            .setFlipY(true);
    }

    createBorders(worldWidth, worldHeight) {
        this.borderTop = this.add.rectangle(worldWidth / 2, 120, worldWidth, 10, 0, 0x000000);
        this.physics.add.existing(this.borderTop, true);

        this.borderBottom = this.add.rectangle(worldWidth / 2, worldHeight - 150, worldWidth, 10, 0, 0x000000);
        this.physics.add.existing(this.borderBottom, true);

        this.borderLeft = this.add.rectangle(360, worldHeight / 2, 10, worldHeight, 0, 0x000000);
        this.physics.add.existing(this.borderLeft, true);

        this.borderRight = this.add.rectangle(worldWidth - 360, worldHeight / 2, 10, worldHeight, 0, 0x000000);
        this.physics.add.existing(this.borderRight, true);
    }

    createDoors() {
        this.add.sprite(window.innerWidth / 2 - 75, 60, "basementDoor")
            .setOrigin(0, 0)
            .setDisplaySize(130, 100);

        this.add.sprite(window.innerWidth - 360, window.innerHeight / 2 - 50, "basementDoor")
            .setOrigin(0, 0)
            .setDisplaySize(130, 100)
            .setRotation(Phaser.Math.DegToRad(90));

        this.add.sprite(window.innerWidth / 2 - 75, window.innerHeight - 155, "basementDoor")
            .setOrigin(0, 0)
            .setDisplaySize(130, 100)
            .setFlipY(true);

        this.add.sprite(380, window.innerHeight / 2 + 70, "basementDoor")
            .setOrigin(0, 0)
            .setDisplaySize(130, 100)
            .setRotation(Phaser.Math.DegToRad(270));
    }

    createSpikes(positions) {
        positions.forEach(position => {
            let spike = this.spikesGroup.create(position.x, position.y, 'spikes');
            spike.setImmovable(true);
            spike.body.moves = false;
            spike.setDepth(1);
            spike.setScale(1.8);
        });
    }
}
