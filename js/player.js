export default class Player {
  constructor(scene) {
    this.scene = scene;

    this.head = scene.add.sprite(0, 0, 'head');
    this.body = scene.add.sprite(0, 17, 'body');

    this.player = scene.add.container(
      window.innerWidth / 2,
      window.innerHeight / 2,
      [this.head, this.body]
    );

    scene.physics.world.enable(this.player);

    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(26, 38);
    this.player.body.setOffset(-15, -14);
    this.player.setDepth(2);
    this.player.setScale(1.8);

    this.hearts = [];
    this.maxHearts = 3;
    this.health = 6;
    this.isInvincible = false;
    this.invincibilityDuration = 1000;
    this.attackSpeed = 400;
    this.lastShotTime = 0;
    this.lastDirection = 'down';
    this.damage = 3;
    this.knockback = 50;

    this.initHearts();

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyZ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyQ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  initHearts() {
    const startX = 100;
    const startY = 70;
    const heartSpacing = 32;

    for (let i = 0; i < this.maxHearts; i++) {
      let heart = this.scene.add
        .image(startX + i * heartSpacing, startY, 'hearts')
        .setFrame(0)
        .setScale(2);
      this.hearts.push(heart);
    }
  }

  changeHealth(dmg) {
    if (dmg < 0 && this.isInvincible) {
      return;
    }

    if (dmg < 0) {
      const randomNumber = Phaser.Math.Between(1, 3);
      this.scene.sound.play(`isaac_hurt_${randomNumber}`, {
        volume: this.scene.scene.get('GameScene').sfxVolume,
      });
      this.startInvincibility();
    } else if (dmg > 0) {
      this.scene.sound.play('isaac_heal', {
        volume: this.scene.scene.get('GameScene').sfxVolume,
      });
    }

    this.health += dmg;
    this.health = Phaser.Math.Clamp(this.health, 0, this.maxHearts * 2);

    this.updateHearts();
    if (this.health === 0) {
      const randomNumber = Phaser.Math.Between(1, 3);
      this.scene.sound.play(`isaac_die_${randomNumber}`, {
        volume: this.scene.scene.get('GameScene').sfxVolume,
      });
      this.scene.scene.get('GameScene').onPlayerDeath();
    }
  }

  updateHearts() {
    for (let i = 0; i < this.maxHearts; i++) {
      let heartValue = this.health - i * 2;

      if (heartValue >= 2) {
        this.hearts[i].setFrame(0);
      } else if (heartValue === 1) {
        this.hearts[i].setFrame(1);
      } else {
        this.hearts[i].setFrame(2);
      }
    }
  }

  startInvincibility() {
    this.isInvincible = true;
    this.player.setAlpha(0.5);
    this.scene.time.delayedCall(this.invincibilityDuration, () => {
      this.isInvincible = false;
      this.player.setAlpha(1);
    });
  }

  update() {
    if (this.health === 0) return;

    const speed = 160;
    let velocityX = 0;
    let velocityY = 0;

    if (this.keyQ.isDown) {
      velocityX = -speed;
    } else if (this.keyD.isDown) {
      velocityX = speed;
    }

    if (this.keyZ.isDown) {
      velocityY = -speed;
    } else if (this.keyS.isDown) {
      velocityY = speed;
    }

    if (velocityX !== 0 && velocityY !== 0) {
      velocityX /= Math.sqrt(2);
      velocityY /= Math.sqrt(2);
    }

    this.player.body.setVelocity(velocityX, velocityY);

    if (velocityX < 0) {
      this.body.anims.play('body_left', true);
      this.head.setFrame('isaac_19');
      this.lastDirection = 'left';
    } else if (velocityX > 0) {
      this.body.anims.play('body_right', true);
      this.head.setFrame('isaac_15');
      this.lastDirection = 'right';
    } else if (velocityY < 0) {
      this.body.anims.play('body_up', true);
      this.head.setFrame('isaac_17');
      this.lastDirection = 'up';
    } else if (velocityY > 0) {
      this.body.anims.play('body_down', true);
      this.head.setFrame('isaac_13');
      this.lastDirection = 'down';
    } else {
      this.body.anims.stop(0);
    }

    if (this.cursors.down.isDown) {
      this.head.setFrame('isaac_14');
      this.tryToShoot('down');
    } else if (this.cursors.right.isDown) {
      this.head.setFrame('isaac_16');
      this.tryToShoot('right');
    } else if (this.cursors.up.isDown) {
      this.head.setFrame('isaac_18');
      this.tryToShoot('up');
    } else if (this.cursors.left.isDown) {
      this.head.setFrame('isaac_20');
      this.tryToShoot('left');
    } else if (
      this.cursors.down.isUp ||
      this.cursors.right.isUp ||
      this.cursors.up.isUp ||
      this.cursors.left.isUp
    ) {
      if (this.lastDirection === 'left') {
        this.head.setFrame('isaac_19');
      } else if (this.lastDirection === 'right') {
        this.head.setFrame('isaac_15');
      } else if (this.lastDirection === 'up') {
        this.head.setFrame('isaac_17');
      } else {
        this.head.setFrame('isaac_13');
      }
    }
  }

  tryToShoot(direction) {
    const currentTime = this.scene.time.now;

    if (currentTime - this.lastShotTime >= this.attackSpeed) {
      this.shootTear(direction);
      this.scene.sound.play('tears_fire', {
        volume: this.scene.scene.get('GameScene').sfxVolume,
      });
      this.lastShotTime = currentTime;
    }
  }

  shootTear(direction) {
    let tearSpeed = 300;
    let tear = this.scene.physics.add.sprite(
      this.player.x,
      this.player.y,
      'tears'
    );
    tear.setScale(0.7);
    tear.damage = this.damage;
    tear.knockback = this.knockback;

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

    this.scene.physics.add.overlap(
      tear,
      this.scene.enemiesGroup,
      (tear, enemy) => {
        let pooter = enemy.getData('instance');
        pooter.takeDamage(tear);
        tear.destroy();
      },
      null,
      this
    );

    switch (direction) {
      case 'left':
        tear.setVelocityX(-tearSpeed);
        break;
      case 'right':
        tear.setVelocityX(tearSpeed);
        break;
      case 'up':
        tear.setVelocityY(-tearSpeed);
        break;
      case 'down':
        tear.setVelocityY(tearSpeed);
        break;
    }
  }

  handleTearCollision(tear) {
    this.scene.sound.play('tears_block', {
      volume: this.scene.scene.get('GameScene').sfxVolume,
    });
    tear.destroy();
  }

  changeScene(newScene, spawnPosition) {
    this.scene.player.player.destroy();
    this.scene = newScene;

    this.head = newScene.add.sprite(0, 0, 'head');
    this.body = newScene.add.sprite(0, 17, 'body');
    this.player = newScene.add.container(
      window.innerWidth / 2,
      window.innerHeight / 2,
      [this.head, this.body]
    );

    newScene.physics.world.enable(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(26, 38);
    this.player.body.setOffset(-15, -14);
    this.player.setDepth(2).setScale(1.8);

    this.player.setPosition(spawnPosition.x, spawnPosition.y);
  }
}
