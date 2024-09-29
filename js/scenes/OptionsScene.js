export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'OptionsScene' });

    this.selectedOption = 0;
  }

  preload() {
    this.load.image('optionsMain', 'assets/ui/pause/mainOptions.png');
    this.load.image('optionArrow', 'assets/ui/pause/arrow.png');
    this.load.image('controls', 'assets/ui/pause/controls.png');
    this.load.image('music', 'assets/ui/pause/music.png');
    this.load.image('sfx', 'assets/ui/pause/sfx.png');

    for (let i = 0; i <= 10; i++) {
      this.load.image(`music${i}`, `assets/ui/pause/music${i}.png`);
      this.load.image(`sfx${i}`, `assets/ui/pause/sfx${i}.png`);
    }
  }

  create() {
    this.musicLevel = this.scene.get('GameScene').musicLevel;
    this.sfxLevel = this.scene.get('GameScene').sfxLevel;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.add
      .image(centerX, centerY, 'optionsMain')
      .setOrigin(0.5, 0.5)
      .setScale(3);

    const spacing = 80;

    this.controlsBtn = this.add
      .image(centerX, centerY - spacing, 'controls')
      .setOrigin(0.5, 0.5)
      .setScale(3)
      .setInteractive({ useHandCursor: true });

    this.musicBtn = this.add
      .image(centerX - 50, centerY, 'music')
      .setOrigin(0.5, 0.5)
      .setScale(3)
      .setInteractive({ useHandCursor: true });

    this.sfxBtn = this.add
      .image(centerX - 60, centerY + spacing, 'sfx')
      .setOrigin(0.5, 0.5)
      .setScale(3)
      .setInteractive({ useHandCursor: true });

    this.musicLevelImg = this.add
      .image(centerX + 150, centerY, `music${this.musicLevel}`)
      .setOrigin(0.5, 0.5)
      .setScale(3);

    this.sfxLevelImg = this.add
      .image(centerX + 150, centerY + spacing, `sfx${this.sfxLevel}`)
      .setOrigin(0.5, 0.5)
      .setScale(3);

    this.optionArrow = this.add
      .image(centerX - 150, centerY - spacing, 'optionArrow')
      .setOrigin(0.5, 0.5)
      .setScale(3);

    let backBtn = this.add
      .image(660, 180, 'optionArrow')
      .setOrigin(0.5, 0.5)
      .setRotation(Phaser.Math.DegToRad(180))
      .setScale(3)
      .setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => {
      this.scene.stop();
      this.scene.resume('PauseScene');
      this.scene.bringToTop('PauseScene');
      this.scene.bringToTop('FadeOverlayScene');
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown-DOWN', () => {
      this.moveSelection(1);
    });

    this.input.keyboard.on('keydown-UP', () => {
      this.moveSelection(-1);
    });

    this.input.keyboard.on('keydown-RIGHT', () => {
      this.changeValue(1);
    });

    this.input.keyboard.on('keydown-LEFT', () => {
      this.changeValue(-1);
    });
  }

  moveSelection(direction) {
    this.selectedOption = (this.selectedOption + direction + 3) % 3;

    const centerY = window.innerHeight / 2;
    const spacing = 80;

    if (this.selectedOption === 0) {
      this.optionArrow.setY(centerY - spacing);
    } else if (this.selectedOption === 1) {
      this.optionArrow.setY(centerY);
    } else if (this.selectedOption === 2) {
      this.optionArrow.setY(centerY + spacing);
    }
  }

  changeValue(direction) {
    const gameScene = this.scene.get('GameScene');

    if (this.selectedOption === 1) {
      this.musicLevel = Phaser.Math.Clamp(this.musicLevel + direction, 0, 10);
      this.musicLevelImg.setTexture(`music${this.musicLevel}`);
      
      gameScene.updateVolume('music', this.musicLevel);
    } else if (this.selectedOption === 2) {
      this.sfxLevel = Phaser.Math.Clamp(this.sfxLevel + direction, 0, 10);
      this.sfxLevelImg.setTexture(`sfx${this.sfxLevel}`);
      
      gameScene.updateVolume('sfx', this.sfxLevel);
    }
  }
}
