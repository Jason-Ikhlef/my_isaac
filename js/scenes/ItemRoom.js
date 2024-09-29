import Doors from '../doors.js';
import Floor from '../floor.js';
import Borders from '../borders.js';

export default class ItemRoom extends Phaser.Scene {
  constructor() {
    super('ItemRoom');
    this.spikePositions = null;

    this.doorsOpen = false;
    this.firstEntrance = true;
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

  setupSpikes() {}

  setupEnemies() {
    this.enemiesGroup = this.physics.add.group();
  }

  doorsController() {
    this.physics.add.collider(this.player.player, this.leftDoor, () => {
      this.scene
        .get('GameScene')
        .changeRoom('SecondRightRoom', this.scene.key, {
          x: window.innerWidth - 498,
          y: window.innerHeight / 2,
        });
    });
    if (!this.doorsOpen) {
      this.updateDoorAppearance();
    } 
    
    if (this.firstEntrance && this.enemiesGroup.children.entries.length > 0) {
      this.scene.get('GameScene').sound.play('doorClose');
      this.firstEntrance = false;
    }
  }

  updateDoorAppearance() {
    const hasEnemies =
      this.enemiesGroup && this.enemiesGroup.children.entries.length > 0;

    this.leftDoor.setTexture(hasEnemies ? 'basementDoor' : 'rightAndLeftDoor');

    if (!hasEnemies) {
      this.leftDoor.setRotation(Phaser.Math.DegToRad(-180));
      this.scene.get('GameScene').sound.play('doorOpen');
      this.doorsOpen = true;
    }
  }

  setupDoors() {
    this.doors = new Doors(this);
    this.leftDoor = this.doors.createLeftDoor();
  }
}
