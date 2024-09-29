import Doors from '../doors.js';
import Floor from '../floor.js';
import Borders from '../borders.js';
import items from '../items.js';

export default class ItemRoom extends Phaser.Scene {
  constructor() {
    super('ItemRoom');
    this.spikePositions = null;

    this.doorsOpen = false;
    this.firstEntrance = true;

    this.selectedItem = null;
  }

  preload() {
    this.load.image('altair', 'assets/items/altair.png');

    this.load.image('<3', 'assets/items/<3.png');
    this.load.image('aries', 'assets/items/aries.png');
  }

  create(data) {
    this.setupWorld();
    this.setupPlayer(data);
    this.setupSpikes(this.spikePositions);
    this.setupEnemies();
    this.setupDoors();
    this.setupItems();
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

  handleResume() {
    this.physics.add.overlap(this.player.player, this.itemSprite, () => {
      this.collectItem(this.selectedItem);
    });
  }

  setupItems() {
    const randomIndex = Phaser.Math.Between(0, items.length - 1);
    this.selectedItem = items[randomIndex];

    this.add
      .image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        'altair'
      )
      .setOrigin(0.5)
      .setScale(2.5);

    this.itemSprite = this.physics.add.sprite(
      window.innerWidth / 2,
      window.innerHeight / 2 - 50,
      this.selectedItem.texture
    );
    this.itemSprite.setScale(2);
    
    this.tweens.add({
      targets: this.itemSprite,
      y: window.innerHeight / 2 - 55,
      ease: 'Sine.easeInOut',
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });

    this.physics.add.overlap(this.player.player, this.itemSprite, () => {
      this.collectItem(this.selectedItem);
    });
  }

  collectItem(item) {
    item.effect(this.player);
    this.itemSprite.destroy();
  }
}
