export default class Pooter {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'pooter');
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(26, 26);
        this.health = 5;
        this.damage = 1;
        this.attackSpeed = 1000;
        this.lastShotTime = 0;
        this.detectionRange = 300;
        this.moveSpeed = 20;
        this.isAlive = true;
        this.knockbackResistance = 10;

        this.moveArea = new Phaser.Geom.Rectangle(x - 20, y - 20, 40, 40);

        scene.physics.add.collider(this.sprite, scene.player.player, this.handlePlayerCollision, null, this);

        this.initMovement();

        this.scene.events.on('update', this.update, this);
        this.sprite.setData('instance', this);
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

    takeDamage(tear) {
        let tearDirectionX = tear.x - this.sprite.x;
        let tearDirectionY = tear.y - this.sprite.y;
    
        let length = Math.sqrt(tearDirectionX * tearDirectionX + tearDirectionY * tearDirectionY);
        if (length !== 0) {
            tearDirectionX /= length;
            tearDirectionY /= length;
        }
    
        this.sprite.body.setVelocity(-tearDirectionX * (tear.knockback - this.knockbackResistance), -tearDirectionY * (tear.knockback - this.knockbackResistance));

        this.health -= tear.damage;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.scene.events.off('update', this.update, this);
        this.scene.physics.world.remove(this.sprite);
        this.sprite.destroy();
        this.scene.enemiesGroup.remove(this.sprite);
        this.isAlive = false;
    }

    handlePlayerCollision(pooter, player) {
        let overlapX = pooter.x - player.x;
        let overlapY = pooter.y - player.y;

        pooter.body.setVelocity(overlapX * 10, overlapY * 10);
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
