import Doors from '../doors.js';
import Floor from '../floor.js';
import Borders from '../borders.js';

export default class ItemRoom extends Phaser.Scene {
  constructor() {
    super('ItemRoom');
    this.spikePositions = null;
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

  setupSpikes() {}

  setupEnemies() {}

  doorsController() {
    if (this.enemiesGroup.children.entries.length === 0) {
      this.physics.add.collider(this.player.player, this.leftDoor, () => {
        this.scene
          .get('GameScene')
          .changeRoom('SecondRightRoom', this.scene.key, { x: 100, y: 300 });
      });
    }
  }

  setupDoors() {
    this.doors = new Doors(this);
    this.leftDoor = this.doors.createLeftDoor();
  }

  onPlayerEnter(player, spawnPosition) {
    if (spawnPosition && spawnPosition.x && spawnPosition.y) {
      player.player.setPosition(spawnPosition.x, spawnPosition.y);
    }
  }
}
