export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        // Charger l'image de l'écran titre
        this.load.image('titleScreen', 'assets/ui/titlescreen.png');
        this.load.audio('title_music', 'sounds/musics/titleScreen.ogg');
    }

    create() {
        const title_music = this.sound.add('title_music');
        title_music.loop = true;
        title_music.play({volume: 0.1});

        let titleScreen = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'titleScreen');
        titleScreen.setOrigin(0.5, 0.5);

        titleScreen.displayWidth = this.cameras.main.width;
        titleScreen.displayHeight = this.cameras.main.height;

        this.input.on('pointerdown', () => {
            title_music.stop();
            this.scene.start('GameScene');
        });
    }
}


// let playButton = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, 'playButton');
// playButton.setOrigin(0.5, 0.5);

// playButton.setInteractive();

// playButton.on('pointerdown', () => {
//     this.scene.start('GameScene');
// });
