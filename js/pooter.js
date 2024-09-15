import Enemy from "./enemy.js";

export default class Pooter extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'pooter', 'pooter');
        this.health = 5;
        this.damage = 1;
        this.attackSpeed = 2000;
        this.lastShotTime = this.scene.time.now;
        this.detectionRange = 300;
        this.moveSpeed = 20;

        this.moveArea = new Phaser.Geom.Rectangle(x - 20, y - 20, 40, 40);

        this.sprite.setScale(1.6);
        this.sprite.setDepth(2);

        this.sprite.play('pooter_fly');

        setTimeout(() => {
            this.initMovement();
          }, 1000);

        this.sprite.on('animationupdate', (animation, frame) => {
            if (animation.key === 'pooter_shoot' && frame.index === 9) {
                this.performShoot();
            }
        });

        this.sprite.on('animationcomplete', function (anim) {
            if (anim.key === 'pooter_shoot') {
                this.sprite.play('pooter_fly');
            }
        }, this);
    }

    initMovement() {
        this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                if (!this.isAlive) return;
                let randomPoint = Phaser.Geom.Rectangle.Random(this.moveArea);
                this.scene.physics.moveToObject(this.sprite, randomPoint, this.moveSpeed);
            },
            loop: true,
        });
    }

    update() {
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.sprite.x,
            this.sprite.y,
            this.scene.player.player.x,
            this.scene.player.player.y
        );

        if (distanceToPlayer <= this.detectionRange) {
            const currentTime = this.scene.time.now;
            if (currentTime - this.lastShotTime >= this.attackSpeed) {
                this.shootAtPlayer();
                this.lastShotTime = currentTime;
            }
        }
    }

    shootAtPlayer() {
        this.sprite.play('pooter_shoot');
    }

    performShoot() {
        this.scene.sound.play('pooter_tears');
        let tear = this.scene.physics.add.sprite(this.sprite.x, (this.sprite.y + 2), 'blood_tears');
        
        let angle = Phaser.Math.Angle.Between(
            this.sprite.x,
            this.sprite.y,
            this.scene.player.player.x,
            this.scene.player.player.y
        );

        let velocity = this.scene.physics.velocityFromRotation(angle, 200);
        tear.setVelocity(velocity.x, velocity.y);

        this.scene.physics.add.collider(tear, this.scene.bordersGroup, this.handleTearCollision.bind(this), null, this.scene);

        this.scene.physics.add.overlap(tear, this.scene.player.player, () => {
            this.scene.player.changeHealth(-this.damage);
            tear.destroy();
        });
    }

    handleTearCollision(tear) {
        this.scene.sound.play('tears_block');
        tear.destroy();
    }
}
