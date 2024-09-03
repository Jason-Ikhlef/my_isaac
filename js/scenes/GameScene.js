import { createPlayer } from "../player.js";
import { createAnimations } from "../animations.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        this.load.spritesheet("basement", "assets/floors/Basement-Floor.png", {
            frameWidth: 233,
            frameHeight: 155,
        });

        this.load.spritesheet("dude", "assets/assetsTuto/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });

        this.load.spritesheet("basementDoor", "assets/floors/Doors.png", {
            frameWidth: 50,
            frameHeight: 33,
        });
    }

    create() {
        const worldWidth = window.innerWidth;
        const worldHeight = window.innerHeight;

        // Création des quarts de pièce
        this.createQuarters(worldWidth, worldHeight);

        // Création des bordures
        this.createBorders(worldWidth, worldHeight);

        // Création des portes
        this.createDoors();

        // Création du joueur
        this.player = createPlayer(this);

        // Création des animations
        createAnimations(this);

        this.cursors = this.input.keyboard.createCursorKeys();

        // Collisions avec les bordures
        this.physics.add.collider(this.player, this.borderTop);
        this.physics.add.collider(this.player, this.borderBottom);
        this.physics.add.collider(this.player, this.borderLeft);
        this.physics.add.collider(this.player, this.borderRight);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-500);
            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(500);
            this.player.anims.play("right", true);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-500);
            this.player.anims.play("turn");
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(500);
            this.player.anims.play("turn");
        } else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.player.anims.play("turn");
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    createQuarters(worldWidth, worldHeight) {
        this.add
            .sprite(worldWidth / 7, 0, "basement")
            .setOrigin(0, 0)
            .setDisplaySize(worldWidth / 2, worldHeight / 2);

        const secondQuarter = this.add
            .sprite(worldWidth / 2, 0, "basement")
            .setOrigin(0, 0)
            .setDisplaySize(worldWidth / 3, worldHeight / 2)
            .setFlipX(true);

        const thirdQuarter = this.add
            .sprite(worldWidth / 7, worldHeight / 2, "basement")
            .setOrigin(0, 0)
            .setDisplaySize(worldWidth / 2, worldHeight / 2)
            .setFlipY(true);

        const fourthQuarter = this.add
            .sprite(worldWidth / 2, worldHeight / 2, "basement")
            .setOrigin(0, 0)
            .setDisplaySize(worldWidth / 3, worldHeight / 2)
            .setFlipX(true)
            .setFlipY(true);
    }

    createBorders(worldWidth, worldHeight) {
        this.borderTop = this.add.rectangle(
            worldWidth / 2,
            120,
            worldWidth,
            10,
            0,
            0x000000
        );
        this.physics.add.existing(this.borderTop, true);

        this.borderBottom = this.add.rectangle(
            worldWidth / 2,
            worldHeight - 150,
            worldWidth,
            10,
            0,
            0x000000
        );
        this.physics.add.existing(this.borderBottom, true);

        this.borderLeft = this.add.rectangle(
            480,
            worldHeight / 2,
            10,
            worldHeight,
            0,
            0x000000
        );
        this.physics.add.existing(this.borderLeft, true);

        this.borderRight = this.add.rectangle(
            worldWidth - 460,
            worldHeight / 2,
            10,
            worldHeight,
            0,
            0x000000
        );
        this.physics.add.existing(this.borderRight, true);
    }

    createDoors() {
        this.add
            .sprite(window.innerWidth / 2 - 75, 60, "basementDoor")
            .setOrigin(0, 0)
            .setDisplaySize(130, 100);

        this.add
            .sprite(
                window.innerWidth - 360,
                window.innerHeight / 2 - 50,
                "basementDoor"
            )
            .setOrigin(0, 0)
            .setDisplaySize(130, 100)
            .setRotation(Phaser.Math.DegToRad(90));

        this.add
            .sprite(
                window.innerWidth / 2 - 75,
                window.innerHeight - 155,
                "basementDoor"
            )
            .setOrigin(0, 0)
            .setDisplaySize(130, 100)
            .setFlipY(true);

        this.add
            .sprite(380, window.innerHeight / 2 + 70, "basementDoor")
            .setOrigin(0, 0)
            .setDisplaySize(130, 100)
            .setRotation(Phaser.Math.DegToRad(270));
    }
}
