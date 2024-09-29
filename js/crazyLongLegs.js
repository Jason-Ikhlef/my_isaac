import Enemy from './enemy.js';

export default class CrazyLongLegs extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'crazyLongLegs', 'crazyLongLegs', true);

    this.health = 10;
    this.damage = 1;

    this.lastShotTime = this.scene.time.now;
    this.moveSpeed = 120;
    this.knockbackResistance = 400;

    this.isAttacking = false;
    this.hasTarget = true;

    this.sprite.setSize(40, 43);
    this.sprite.setOffset(-1, 0);
    this.sprite.setScale(2);

    this.scene.time.addEvent({
      delay: 100,
      callback: this.updateTargetPosition,
      callbackScope: this,
      loop: true,
    });

    this.sprite.play('crazyLongLegs_move');

    this.sprite.on('animationupdate', (animation, frame) => {
      if (animation.key === 'crazyLongLegs_shoot' && frame.index === 3) {
        this.shootInAllDirections();
      }
    });

    this.sprite.on(
      'animationcomplete',
      function (anim) {
        if (anim.key === 'crazyLongLegs_shoot') {
          this.sprite.play('crazyLongLegs_move');
        }
      },
      this
    );

    this.scene.physics.add.collider(this, this.scene.bordersGroup);
    this.scene.physics.add.collider(this, this.scene.rocksGroup);

    this.generateRandomStats();
  }

  generateRandomStats() {
    this.attackSpeed = Phaser.Math.Between(2000, 5000);
    this.attackRange = Phaser.Math.Between(30, 200);
  }

  updateTargetPosition() {
    if (!this.isAlive || this.isAttacking) return;

    const player = this.scene.player.player;
    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      player.x,
      player.y
    );

    const currentTime = this.scene.time.now;

    if (
      distanceToPlayer > this.attackRange ||
      currentTime - this.lastShotTime < this.attackSpeed
    ) {
      if (this.sprite.anims.currentAnim?.key !== 'crazyLongLegs_move') {
        this.sprite.play('crazyLongLegs_move');
      }
      this.scene.physics.moveToObject(this.sprite, player, this.moveSpeed);
    } else {
      this.stopAndAttack();
    }
  }

  stopAndAttack() {
    if (!this.isAlive || this.isAttacking) return;

    this.sprite.play('crazyLongLegs_shoot');

    this.isAttacking = true;
    this.sprite.body.setVelocity(0, 0);

    this.shootInAllDirections();
    this.shootAtPlayer();
    this.lastShotTime = this.scene.time.now;

    this.generateRandomStats();

    this.scene.time.delayedCall(1000, () => {
      this.isAttacking = false;
    });
  }

  shootAtPlayer() {
    this.sprite.play('crazyLongLegs_shoot');
  }

  shootInAllDirections() {
    this.scene.sound.play('crazyLongLegs_tears', {
      volume: this.scene.scene.get('GameScene').sfxVolume,
    });

    const numProjectiles = 8;
    const angleStep = (2 * Math.PI) / numProjectiles;

    for (let i = 0; i < numProjectiles; i++) {
      const angle = i * angleStep;
      const velocity = this.scene.physics.velocityFromRotation(angle, 200);

      let tear = this.scene.physics.add.sprite(
        this.sprite.x,
        this.sprite.y,
        'blood_tears'
      );
      tear.setVelocity(velocity.x, velocity.y);

      this.scene.physics.add.collider(
        tear,
        this.scene.bordersGroup,
        this.handleTearCollision.bind(this),
        null,
        this.scene
      );

      this.scene.physics.add.collider(
        tear,
        this.scene.rocksGroup,
        this.handleTearCollision.bind(this),
        null,
        this.scene
      );

      this.scene.physics.add.overlap(tear, this.scene.player.player, () => {
        this.scene.player.changeHealth(-this.damage);
        tear.destroy();
      });
    }
  }

  handleTearCollision(tear) {
    this.scene.sound.play('tears_block', {
      volume: this.scene.scene.get('GameScene').sfxVolume,
    });
    tear.destroy();
  }
}
