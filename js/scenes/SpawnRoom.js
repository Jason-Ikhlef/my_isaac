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
    // this.setupSpikes(this.spikePositions);
    // this.setupEnemies();
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
        y: window.innerHeight - 210,
      });
    });
    this.physics.add.collider(this.player.player, this.rightDoor, () => {
      this.scene.get('GameScene').changeRoom('FirstRightRoom', this.scene.key, {
        x: 530,
        y: window.innerHeight / 2,
      });
    });
  }

  setupEnemies() {
    this.enemiesGroup = this.physics.add.group();
    let crazyLongLegs = new CrazyLongLegs(
      this,
      window.innerWidth / 2 + 100,
      window.innerHeight / 2
    );
    this.enemiesGroup.add(crazyLongLegs.sprite);
    crazyLongLegs = new CrazyLongLegs(
      this,
      window.innerWidth / 2 - 100,
      window.innerHeight / 2
    );
    this.enemiesGroup.add(crazyLongLegs.sprite);
    this.physics.add.collider(this.enemiesGroup, this.bordersGroup);
    this.physics.add.collider(this.enemiesGroup, this.rocksGroup);
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
      let spike = this.rocksGroup.create(position.x, position.y, 'rock');
      spike.setImmovable(true);
      spike.setDepth(1).setScale(1.8);
    });

    this.physics.add.collider(this.player.player, this.rocksGroup);
  }

  handleResume() {}
}
