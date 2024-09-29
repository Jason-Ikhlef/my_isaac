export default class DeathScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DeathScene' });
  }

  preload() {
    this.load.image('mainDeath', 'assets/ui/death/main.png');
    this.load.image('place', 'assets/ui/death/basement.png');

    this.load.image('portait1', 'assets/ui/death/portait1.png');
    this.load.image('portait2', 'assets/ui/death/portait2.png');
    this.load.image('portait3', 'assets/ui/death/portait3.png');
    this.load.image('portait4', 'assets/ui/death/portait4.png');
    this.load.image('portait5', 'assets/ui/death/portait5.png');
    this.load.image('portait6', 'assets/ui/death/portait6.png');
    this.load.image('portait7', 'assets/ui/death/portait7.png');
    this.load.image('portait8', 'assets/ui/death/portait8.png');
    this.load.image('portait9', 'assets/ui/death/portait9.png');
    this.load.image('portait10', 'assets/ui/death/portait10.png');
    this.load.image('portait11', 'assets/ui/death/portait11.png');
    this.load.image('portait12', 'assets/ui/death/portait12.png');
    this.load.image('portait13', 'assets/ui/death/portait13.png');
  }

  create() {
    let mainDeath = this.add.image(
      window.innerWidth / 2,
      window.innerHeight / 2,
      'mainDeath'
    );

    mainDeath.setOrigin(0.5, 0.5).setScale(3);

    const randomNumber = Phaser.Math.Between(1, 13);

    this.add.image(825, 270, `portait${randomNumber}`).setScale(2.2);

    this.add.image(510, 438, 'place').setScale(2.4);
  }
}
