import Pooter from '../pooter.js';
import Doors from '../doors.js';
import Floor from '../floor.js';
import Borders from '../borders.js';

export default class SecondTopRoom extends Phaser.Scene {
  constructor() {
    super('SecondTopRoom');

    let midWidth = window.innerWidth / 2;
    let midHeight = window.innerHeight / 2;
    this.spikePositions = [
      { x: midWidth, y: midHeight - 150 },
      { x: midWidth, y: midHeight + 150 },
      { x: midWidth + 45, y: midHeight - 150 },
      { x: midWidth + 90, y: midHeight - 150 },
      { x: midWidth + 135, y: midHeight - 150 },
      { x: midWidth - 45, y: midHeight - 150 },
      { x: midWidth - 90, y: midHeight - 150 },
      { x: midWidth - 135, y: midHeight - 150 },
      { x: midWidth + 45, y: midHeight + 150 },
      { x: midWidth + 90, y: midHeight + 150 },
      { x: midWidth + 135, y: midHeight + 150 },
      { x: midWidth - 45, y: midHeight + 150 },
      { x: midWidth - 90, y: midHeight + 150 },
      { x: midWidth - 135, y: midHeight + 150 },
      { x: midWidth + 180, y: midHeight + 100 },
      { x: midWidth + 180, y: midHeight + 50 },
      { x: midWidth + 180, y: midHeight },
      { x: midWidth + 180, y: midHeight - 50 },
      { x: midWidth + 180, y: midHeight - 100 },
      { x: midWidth - 180, y: midHeight + 100 },
      { x: midWidth - 180, y: midHeight + 50 },
      { x: midWidth - 180, y: midHeight },
      { x: midWidth - 180, y: midHeight - 50 },
      { x: midWidth - 180, y: midHeight - 100 },
    ];
  }

  create(data) {
    this.setupWorld();
    this.setupPlayer(data);
    this.setupSpikes(this.spikePositions);
    this.setupEnemies();
    this.setupDoors();
  }

  update() {
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

    if (data.spawnPosition && data.spawnPosition.x && data.spawnPosition.y) {
      this.player.player.setPosition(
        data.spawnPosition.x,
        data.spawnPosition.y
      );
    }

    this.physics.add.collider(this.player.player, this.bordersGroup);
  }

  setupSpikes(positions) {
    this.spikesGroup = this.physics.add.group({ immovable: true });
    positions.forEach((position) => {
      let spike = this.spikesGroup.create(position.x, position.y, 'spikes');
      spike.setImmovable(true);
      spike.setDepth(1).setScale(1.8);
    });

    this.physics.add.overlap(this.player.player, this.spikesGroup, () => {
      if (!this.player.isInvincible) {
        this.player.changeHealth(-1);
        this.player.startInvincibility();
      }
    });
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
    this.physics.add.collider(this.enemiesGroup, this.bordersGroup);
    this.physics.add.collider(this.enemiesGroup, this.rocksGroup);
  }

  doorsController() {
    if (this.enemiesGroup.children.entries.length === 0) {
      this.physics.add.collider(this.player.player, this.downDoor, () => {
        this.scene.get('GameScene').changeRoom('FirstTopRoom', this.scene.key, {
          x: window.innerWidth / 2,
          y: window.innerHeight - 750,
        });
      });
      this.physics.add.collider(this.player.player, this.upDoor, () => {
        this.scene.get('GameScene').changeRoom('ThirdTopRoom', this.scene.key, {
          x: window.innerWidth / 2,
          y: window.innerHeight - 210,
        });
      });
    }
  }

  setupDoors() {
    this.doors = new Doors(this);
    this.upDoor = this.doors.createUpDoor();
    this.downDoor = this.doors.createDownDoor();
  }

  handleResume() {
    this.physics.add.overlap(this.player.player, this.spikesGroup, () => {
      if (!this.player.isInvincible) {
        this.player.changeHealth(-1);
        this.player.startInvincibility();
      }
    });
  }
}
