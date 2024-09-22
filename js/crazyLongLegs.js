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

        this.sprite.setScale(2);
        this.sprite.setDepth(2);

        this.scene.time.addEvent({
            delay: 100,
            callback: this.updateTargetPosition,
            callbackScope: this,
            loop: true,
        });

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

        if (distanceToPlayer > this.attackRange || currentTime - this.lastShotTime < this.attackSpeed) {
            this.scene.physics.moveToObject(this.sprite, player, this.moveSpeed);
        } else {
            this.stopAndAttack();
        }
    }

    stopAndAttack() {
        if (!this.isAlive || this.isAttacking) return;

        this.isAttacking = true;
        this.sprite.body.setVelocity(0, 0);
        this.shootInAllDirections();

        this.lastShotTime = this.scene.time.now;

        this.generateRandomStats();

        this.scene.time.delayedCall(1000, () => {
            this.isAttacking = false;
        });
    }

    shootInAllDirections() {
        this.scene.sound.play('crazyLongLegs_tears');

        const numProjectiles = 8;
        const angleStep = (2 * Math.PI) / numProjectiles;

        for (let i = 0; i < numProjectiles; i++) {
            const angle = i * angleStep;
            const velocity = this.scene.physics.velocityFromRotation(angle, 200);

            let tear = this.scene.physics.add.sprite(this.sprite.x, this.sprite.y, 'blood_tears');
            tear.setVelocity(velocity.x, velocity.y);

            this.scene.physics.add.collider(tear, this.scene.bordersGroup, this.handleTearCollision.bind(this), null, this.scene);

            this.scene.physics.add.overlap(tear, this.scene.player.player, () => {
                this.scene.player.changeHealth(-this.damage);
                tear.destroy();
            });
        }
    }

    handleTearCollision(tear) {
        this.scene.sound.play('tears_block');
        tear.destroy();
    }
}
