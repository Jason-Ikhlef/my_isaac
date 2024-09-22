export default class Enemy {
    constructor(scene, x, y, texture, name, contactDmg) {
        this.scene = scene;
        this.name = name;
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(26, 26);
        this.isAlive = true;
        this.contactDmg = contactDmg;
        this.knockbackResistance = 0;
        this.lastCollisionTime = 0;

        scene.physics.add.collider(this.sprite, scene.player.player, this.handlePlayerCollision, null, this);
        scene.physics.add.collider(this.sprite, scene.bordersGroup);

        this.scene.events.on('update', this.update, this);
        this.sprite.setData('instance', this);

        this.ambientSound = null;

        this.initAmbianceSound();
    }

    initAmbianceSound() {
        if (this.scene.sound.get(`${this.name}_sound`)) {
            this.ambientSound = this.scene.sound.add(`${this.name}_sound`);
            this.ambientSound.loop = true;
            this.ambientSound.play();
        }
    }

    takeDamage(tear) {        
        let tearDirectionX = tear.x - this.sprite.x;
        let tearDirectionY = tear.y - this.sprite.y;
    
        let length = Math.sqrt(tearDirectionX ** 2 + tearDirectionY ** 2);
        if (length !== 0) {
            tearDirectionX /= length;
            tearDirectionY /= length;
        }
    
        this.sprite.body.setVelocity(-tearDirectionX * (tear.knockback - this.knockbackResistance), -tearDirectionY * (tear.knockback - this.knockbackResistance));
        
        this.sprite.setTintFill(0xff0000);

        this.scene.time.delayedCall(100, () => {
            this.sprite.clearTint();
        });

        this.health -= tear.damage;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.scene.sound.play(`${this.name}_die`)
        this.scene.events.off('update', this.update, this);
        this.scene.physics.world.remove(this.sprite);
        this.sprite.destroy();
        this.isAlive = false;

        if (this.ambientSound && this.ambientSound.isPlaying) {
            this.ambientSound.stop();
        }
    }

    handlePlayerCollision(enemy, player) {
        const currentTime = this.scene.time.now;

        if (currentTime - this.lastCollisionTime > 500) {
            let overlapX = enemy.x - player.x;
            let overlapY = enemy.y - player.y;

            const knockbackForce = 5 / (this.knockbackResistance + 1);

            enemy.body.setVelocity(overlapX * knockbackForce, overlapY * knockbackForce);

            this.lastCollisionTime = currentTime;

            if (this.contactDmg) {
                this.scene.player.changeHealth(-this.damage);
            }
        }
    }

    update() {
    }
}
