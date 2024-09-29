export default class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  preload() {
    this.load.image('mainPause', 'assets/ui/pause/main.png');
  }

  create() {
    let mainPause = this.add.image(
      window.innerWidth / 2,
      window.innerHeight / 2,
      'mainPause'
    );

    mainPause.setOrigin(0.5, 0.5).setScale(3);

    let resumeBtn = this.add
      .zone(window.innerWidth / 2 - 200, window.innerHeight / 2 + 115, 380, 60)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });

    let exitBtn = this.add
      .zone(window.innerWidth / 2 - 200, window.innerHeight / 2 + 180, 380, 60)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });

    let optionBtn = this.add
      .zone(window.innerWidth / 2 - 170, window.innerHeight / 2 + 30, 340, 60)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });

    resumeBtn.on('pointerdown', () => {
      this.scene.get('GameScene').togglePause(true);
    });

    optionBtn.on('pointerdown', () => {
      this.scene.pause();
      this.scene.setVisible(false);
      this.scene.launch('OptionsScene');
      this.scene.bringToTop('OptionsScene');
      this.scene.bringToTop('FadeOverlayScene');
    });
    
    exitBtn.on('pointerdown', () => {
      // methode de secours
      location.reload();

      // ça marche pas
      //   for (const scene of this.scene.manager.getScenes(false)) {
      //     scene.events.off();
      //     scene.physics.world.shutdown();
      //     scene.scene.stop();
      //   }

      //   this.registry.destroy();
      //   this.events.off();

      //   this.scene.start('TitleScene');
      //   this.scene.bringToTop('TitleScene');
    });
  }
}
