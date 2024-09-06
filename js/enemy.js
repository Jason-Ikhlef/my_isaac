export default class Enemy {
    constructor(scene, x, y, texture, name) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(26, 26);
        this.health = 5;
        this.isAlive = true;
        this.knockbackResistance = 10;

        scene.physics.add.collider(this.sprite, scene.player.player, this.handlePlayerCollision, null, this);

        this.scene.events.on('update', this.update, this);
        this.sprite.setData('instance', this);
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

        this.health -= tear.damage;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.scene.events.off('update', this.update, this);
        this.scene.physics.world.remove(this.sprite);
        this.sprite.destroy();
        this.isAlive = false;
    }

    handlePlayerCollision(enemy, player) {
        let overlapX = enemy.x - player.x;
        let overlapY = enemy.y - player.y;

        enemy.body.setVelocity(overlapX * 10, overlapY * 10);
    }

    update() {
    }
}
