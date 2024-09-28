export default class FadeOverlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FadeOverlayScene' });
  }

  create() {
    this.overlay = this.add.graphics();
    this.overlay.fillStyle(0x000000, 0);
    this.overlay.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  fadeToBlack(duration, onComplete) {
    this.tweens.add({
      targets: this.overlay,
      alpha: { from: 0, to: 1 },
      duration: duration,
      onComplete: onComplete,
    });
  }

  fadeFromBlack(duration, onComplete) {
    this.tweens.add({
      targets: this.overlay,
      alpha: { from: 1, to: 0 },
      duration: duration,
      onComplete: onComplete,
    });
  }

  resetOverlay() {
    this.overlay.clear();
    this.overlay.fillStyle(0x000000, 0);
    this.overlay.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }
}
