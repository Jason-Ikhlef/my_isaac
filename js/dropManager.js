export default class DropManager {
    constructor(scene) {
        this.scene = scene;

        this.lootTables = {
            pooter: [
                { item: 'bomb', dropRate: [1, 30] },
                { item: 'key', dropRate: [31, 50] },
                { item: 'coin', dropRate: [51, 90] },
                { item: 'heart', dropRate: [91, 100] }
            ]
        };
    }

    dropMob(name, x, y) {
        const lootTable = this.lootTables[name];

        if (!lootTable) {
            console.warn(`Pas de loot table pour le monstre ${name}`);
            return;
        }

        const randomRoll = Phaser.Math.Between(1, 100);
        for (const loot of lootTable) {
            const [minRate, maxRate] = loot.dropRate;
            if (randomRoll >= minRate && randomRoll <= maxRate) {
                this.dropItem(loot.item, x, y);
                return;
            }
        }
    }

    dropItem(item, x, y) {
        switch (item) {
            case 'heart':
                this.dropHeart(x, y);
                break;
            case 'bomb':
                this.dropBomb(x, y);
                break;
            case 'key':
                this.dropKey(x, y);
                break;
            case 'coin':
                this.dropCoin(x, y);
                break;
            default:
                console.warn(`Objet ${item} introuvable`);
                break;
        }
    }

    dropHeart(x, y) {
        const dropRate = Phaser.Math.Between(1, 10);

        if (dropRate === 1) {
            const fullHeartRate = Phaser.Math.Between(1, 10);

            let heartValue, spriteName;
            if (fullHeartRate === 1) {
                heartValue = 2;
                spriteName = 'red_half_heart';
            } else {
                heartValue = 1;
                spriteName = 'red_heart';
            }

            const heart = this.scene.physics.add.sprite(x, y, spriteName);

            this.scene.physics.add.overlap(heart, this.scene.player.player, () => {
                this.scene.player.changeHealth(heartValue);
                heart.destroy();
            });
        }
    }

    dropBomb(x, y) {
        // un jour inch
    }

    dropKey(x, y) {
        // un jour inch
    }

    dropCoin(x, y) {
        // un jour inch
    }
}
