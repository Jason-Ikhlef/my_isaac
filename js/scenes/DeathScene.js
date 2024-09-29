export default class DeathScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DeathScene' });
  }

  preload() {
    this.load.image('mainDeath', 'assets/ui/death/main.png');
    this.load.image('place', 'assets/ui/death/basement.png');

    for (let i = 1; i <= 13; i++) {
      this.load.image(`portait${i}`, `assets/ui/death/portait${i}.png`);
    }
  }

  create() {
    let mainDeath = this.add.image(
      window.innerWidth / 2,
      window.innerHeight / 2,
      'mainDeath'
    );

    mainDeath.setOrigin(0.5, 0.5).setScale(3);

    const randomNumber = Phaser.Math.Between(1, 13);

    this.add.image(1170, 270, `portait${randomNumber}`).setScale(2.2);

    this.add.image(850, 438, 'place').setScale(2.4);
  }
}
