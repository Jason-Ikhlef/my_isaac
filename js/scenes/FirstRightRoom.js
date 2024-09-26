import Doors from '../doors.js';
import Floor from '../floor.js';
import Borders from '../borders.js';
import Pooter from '../pooter.js';
import CrazyLongLegs from '../crazyLongLegs.js';

export default class FirstRightRoom extends Phaser.Scene {
  constructor() {
    super('FirstRightRoom');
    this.spikePositions = [
      { x: 1380, y: 235 },
      { x: 565, y: 665 },
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
    let pooter = new Pooter(this, 500, 300);
    let crazyLongLegs = new CrazyLongLegs(this, 800, 500);
    this.enemiesGroup.add(pooter.sprite);
    this.enemiesGroup.add(crazyLongLegs.sprite);
  }

  doorsController() {
    if (this.enemiesGroup.children.entries.length === 0) {
      this.physics.add.collider(this.player.player, this.leftDoor, () => {
        this.scene
          .get('GameScene')
          .changeRoom('SpawnRoom', this.scene.key, { x: 100, y: 300 });
      });
      this.physics.add.collider(this.player.player, this.rightDoor, () => {
        this.scene
          .get('GameScene')
          .changeRoom('SecondRightRoom', this.scene.key, { x: 100, y: 300 });
      });
    }
  }

  setupDoors() {
    this.doors = new Doors(this);
    this.leftDoor = this.doors.createLeftDoor();
    this.rightDoor = this.doors.createRightDoor();
  }

  onPlayerEnter(player, spawnPosition) {
    if (spawnPosition && spawnPosition.x && spawnPosition.y) {
      player.player.setPosition(spawnPosition.x, spawnPosition.y);
    }
  }
}
