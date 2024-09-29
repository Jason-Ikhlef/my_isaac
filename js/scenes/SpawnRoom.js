import Doors from '../doors.js';
import Floor from '../floor.js';
import Borders from '../borders.js';

export default class SpawnRoom extends Phaser.Scene {
  constructor() {
    super('SpawnRoom');

    this.doorsOpen = false;
    this.firstEntrance = true;
  }

  create(data) {
    this.setupWorld();
    this.setupPlayer(data);
    // this.setupSpikes(this.spikePositions);
    this.setupEnemies();
    this.setupDoors();

    this.add
      .image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        'spawnControls'
      )
      .setOrigin(0.5)
      .setScale(2);
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

  setupDoors() {
    this.doors = new Doors(this);
    this.upDoor = this.doors.createUpDoor();
    this.rightDoor = this.doors.createRightDoor();
  }

  doorsController() {
    if (this.enemiesGroup.children.entries.length === 0) {
      this.physics.add.collider(this.player.player, this.upDoor, () => {
        this.scene.get('GameScene').changeRoom('FirstTopRoom', this.scene.key, {
          x: window.innerWidth / 2,
          y: window.innerHeight - 210,
        });
      });
      this.physics.add.collider(this.player.player, this.rightDoor, () => {
        this.scene
          .get('GameScene')
          .changeRoom('ItemRoom', this.scene.key, {
            x: 530,
            y: window.innerHeight / 2,
          });
      });
    }

    if (!this.doorsOpen) {
      this.updateDoorAppearance();
    }

    if (this.firstEntrance && this.enemiesGroup) {
      this.scene.get('GameScene').sound.play('doorClose');
      this.firstEntrance = false;
    }
  }

  updateDoorAppearance() {
    const hasEnemies =
      this.enemiesGroup && this.enemiesGroup.children.entries.length > 0;

    this.upDoor.setTexture(hasEnemies ? 'basementDoor' : 'upAndDownDoor');

    this.rightDoor.setTexture(hasEnemies ? 'basementDoor' : 'rightAndLeftDoor');

    if (!hasEnemies) {
      this.rightDoor.setRotation(0);
      this.scene.get('GameScene').sound.play('doorOpen');
      this.doorsOpen = true;
    }
  }

  setupEnemies() {
    this.enemiesGroup = this.physics.add.group();
  }

  setupSpikes(positions) {}

  setupRocks(positions) {}

  handleResume() {}
}
