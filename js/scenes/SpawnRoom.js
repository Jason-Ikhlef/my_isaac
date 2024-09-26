import Doors from '../doors.js';
import Floor from '../floor.js';
import Borders from '../borders.js';

export default class SpawnRoom extends Phaser.Scene {
  constructor() {
    super('SpawnRoom');
  }

  create(data) {
    this.setupWorld();
    this.setupPlayer(data);
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

  setupDoors() {
    this.doors = new Doors(this);
    this.upDoor = this.doors.createUpDoor();
    this.rightDoor = this.doors.createRightDoor();
  }

  doorsController() {
    this.physics.add.collider(this.player.player, this.upDoor, () => {
      this.scene.get('GameScene').changeRoom('FirstTopRoom', this.scene.key, {
        x: window.innerWidth / 2,
        y: window.innerHeight - 198,
      });
    });
    this.physics.add.collider(this.player.player, this.rightDoor, () => {
      this.scene.get('GameScene').changeRoom('FirstRightRoom', this.scene.key);
    });
  }

  onPlayerEnter(player, spawnPosition) {
    console.log(player);
    this.player = player.player;

    if (spawnPosition && spawnPosition.x && spawnPosition.y) {
      player.player.setPosition(spawnPosition.x, spawnPosition.y);
    }
  }
}
