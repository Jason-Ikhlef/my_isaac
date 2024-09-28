import Doors from "../doors.js";
import Floor from "../floor.js";
import Borders from "../borders.js";
import Pooter from "../pooter.js";

export default class SpawnRoom extends Phaser.Scene {
    constructor() {
        super("SpawnRoom");

        this.rockPositions = [
            { x: 625, y: 235 },
            { x: 580, y: 285 },
            { x: 1325, y: 235 },
            { x: 1370, y: 285 },
            { x: 575, y: 615 },
            { x: 620, y: 665 },
            { x: 1370, y: 615 },
            { x: 1325, y: 665 },
        ];
    }

    create(data) {
        this.setupWorld();
        this.setupPlayer(data);
        this.setupRocks(this.rockPositions);
        this.setupEnemies();
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

    setupEnemies() {
        this.enemiesGroup = this.physics.add.group();
        let pooter = new Pooter(this, 580, 235);
        this.enemiesGroup.add(pooter.sprite);
        pooter = new Pooter(this, 1370, 235);
        this.enemiesGroup.add(pooter.sprite);
        pooter = new Pooter(this, 575, 665);
        this.enemiesGroup.add(pooter.sprite);
        pooter = new Pooter(this, 1370, 665);
        this.enemiesGroup.add(pooter.sprite);
    }

    setupDoors() {
        this.doors = new Doors(this);
        this.upDoor = this.doors.createUpDoor();
        this.rightDoor = this.doors.createRightDoor();
    }

    doorsController() {
        this.physics.add.collider(this.player.player, this.upDoor, () => {
            this.scene
                .get("GameScene")
                .changeRoom("FirstTopRoom", this.scene.key, {
                    x: window.innerWidth / 2,
                    y: window.innerHeight - 198,
                });
        });
        this.physics.add.collider(this.player.player, this.rightDoor, () => {
            this.scene
                .get("GameScene")
                .changeRoom("FirstRightRoom", this.scene.key, {
                    x: 530,
                    y: window.innerHeight / 2,
                });
        });
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
}
