import Doors from '../doors.js';
import Floor from '../floor.js';
import Borders from '../borders.js';
import Pooter from '../pooter.js';
import CrazyLongLegs from '../crazyLongLegs.js';

export default class FirstRightRoom extends Phaser.Scene {
  constructor() {
    super('FirstRightRoom');

    this.doorsOpen = false;
    this.firstEntrance = true;

    let midWitdh = window.innerWidth / 2;
    let midHeight = window.innerHeight / 2;
    this.rockPositions = [
      { x: midWitdh, y: midHeight },
      { x: midWitdh + 45, y: midHeight },
      { x: midWitdh + 90, y: midHeight },
      { x: midWitdh - 45, y: midHeight },
      { x: midWitdh - 90, y: midHeight },
      { x: midWitdh, y: midHeight + 50 },
      { x: midWitdh, y: midHeight + 100 },
      { x: midWitdh, y: midHeight - 50 },
      { x: midWitdh, y: midHeight - 100 },
      { x: midWitdh - 45, y: midHeight + 50 },
      { x: midWitdh + 45, y: midHeight + 50 },
      { x: midWitdh + 45, y: midHeight - 50 },
      { x: midWitdh - 45, y: midHeight - 50 },
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

  setupEnemies() {
    this.enemiesGroup = this.physics.add.group();
    let crazyLongLegs = new CrazyLongLegs(this, 580, 235);
    this.enemiesGroup.add(crazyLongLegs.sprite);
    crazyLongLegs = new CrazyLongLegs(this, 1370, 235);
    this.enemiesGroup.add(crazyLongLegs.sprite);
    crazyLongLegs = new CrazyLongLegs(this, 575, 665);
    this.enemiesGroup.add(crazyLongLegs.sprite);
    crazyLongLegs = new CrazyLongLegs(this, 1370, 665);
    this.enemiesGroup.add(crazyLongLegs.sprite);
    this.physics.add.collider(this.enemiesGroup, this.bordersGroup);
    this.physics.add.collider(this.enemiesGroup, this.rocksGroup);
  }

  setupRocks(positions) {
    this.rocksGroup = this.physics.add.group({ immovable: true });
    positions.forEach((position) => {
      let spike = this.rocksGroup.create(position.x, position.y, 'rock');
      spike.setImmovable(true);
      spike.setDepth(1).setScale(1.8);
    });

    this.physics.add.collider(this.player.player, this.rocksGroup);
  }

  doorsController() {
    if (this.enemiesGroup.children.entries.length === 0) {
      this.physics.add.collider(this.player.player, this.leftDoor, () => {
        this.scene.get('GameScene').changeRoom('SpawnRoom', this.scene.key, {
          x: window.innerWidth - 498,
          y: window.innerHeight / 2,
        });
      });
      this.physics.add.collider(this.player.player, this.rightDoor, () => {
        this.scene
          .get('GameScene')
          .changeRoom('SecondRightRoom', this.scene.key, {
            x: 530,
            y: window.innerHeight / 2,
          });
      });
    }

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

    this.rightDoor.setTexture(hasEnemies ? 'basementDoor' : 'rightAndLeftDoor');
    this.leftDoor.setTexture(hasEnemies ? 'basementDoor' : 'rightAndLeftDoor');

    if (!hasEnemies) {
      this.rightDoor.setRotation(0);
      this.leftDoor.setRotation(Phaser.Math.DegToRad(-180));
      this.scene.get('GameScene').sound.play('doorOpen');
      this.doorsOpen = true;
    }
  }

  setupDoors() {
    this.doors = new Doors(this);
    this.leftDoor = this.doors.createLeftDoor();
    this.rightDoor = this.doors.createRightDoor();
  }

  handleResume() {
    this.physics.add.collider(this.player.player, this.rocksGroup);
  }
}
