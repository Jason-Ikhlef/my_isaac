import Pooter from '../pooter.js';
import Doors from '../doors.js';
import Floor from '../floor.js';
import Borders from '../borders.js';

export default class FirstTopRoom extends Phaser.Scene {
  constructor() {
    super('FirstTopRoom');

    this.doorsOpen = false;
    this.firstEntrance = true;

    this.spikePositions = [
      { x: 565, y: 235 },
      { x: 1380, y: 235 },
      { x: 565, y: 665 },
      { x: 1380, y: 665 },
    ];

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
    this.setupSpikes(this.spikePositions);
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

  setupRocks(positions) {
    this.rocksGroup = this.physics.add.group({ immovable: true });
    positions.forEach((position) => {
      let rock = this.rocksGroup.create(position.x, position.y, 'rock');
      rock.setImmovable(true);
      rock.setDepth(1).setScale(1.8);
    });

    this.physics.add.collider(this.player.player, this.rocksGroup);
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
        this.scene.get('GameScene').changeRoom('SpawnRoom', this.scene.key, {
          x: window.innerWidth / 2,
          y: window.innerHeight - 750,
        });
      });
      this.physics.add.collider(this.player.player, this.upDoor, () => {
        this.scene
          .get('GameScene')
          .changeRoom('SecondTopRoom', this.scene.key, {
            x: window.innerWidth / 2,
            y: window.innerHeight - 210,
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

    this.downDoor.setTexture(hasEnemies ? 'basementDoor' : 'upAndDownDoor');
    this.upDoor.setTexture(hasEnemies ? 'basementDoor' : 'upAndDownDoor');

    if (!hasEnemies) {
      this.scene.get('GameScene').sound.play('doorOpen');
      this.doorsOpen = true;
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

    this.physics.add.collider(this.player.player, this.rocksGroup);
  }
}
