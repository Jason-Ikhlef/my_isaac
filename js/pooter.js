import Enemy from "./enemy.js";

export default class Pooter extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'pooter', 'pooter');
        this.health = 5;
        this.damage = 1;
        this.attackSpeed = 1000;
        this.lastShotTime = 0;
        this.detectionRange = 300;
        this.moveSpeed = 20;

        this.moveArea = new Phaser.Geom.Rectangle(x - 20, y - 20, 40, 40);

        this.initMovement();
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
        let tear = this.scene.physics.add.sprite(this.sprite.x, this.sprite.y, 'enemyTear');
        tear.setScale(0.5);

        let angle = Phaser.Math.Angle.Between(
            this.sprite.x,
            this.sprite.y,
            this.scene.player.player.x,
            this.scene.player.player.y
        );

        let velocity = this.scene.physics.velocityFromRotation(angle, 200);
        tear.setVelocity(velocity.x, velocity.y);

        tear.setCollideWorldBounds(true);
        tear.body.onWorldBounds = true;
        tear.body.world.on('worldbounds', (body) => {
            if (body.gameObject === tear) {
                tear.destroy();
            }
        });

        this.scene.physics.add.overlap(tear, this.scene.player.player, () => {
            this.scene.player.changeHealth(-this.damage);
            tear.destroy();
        });
    }
}
