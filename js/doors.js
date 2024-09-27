export default class Doors {
  constructor(scene) {
    this.scene = scene;
  }

  createUpDoor() {
    this.upDoor = this.scene.add
      .sprite(window.innerWidth / 2 - 75, 55, 'basementDoor')
      .setOrigin(0, 0)
      .setDisplaySize(130, 100)
    this.scene.physics.add.existing(this.upDoor, true);
    this.upDoor.body.setSize(50, 80);
    return this.upDoor;
  }

  createRightDoor() {
    this.rightDoor = this.scene.add
      .sprite(
        window.innerWidth - 460,
        window.innerHeight / 2 - 50,
        'basementDoor'
      )
      .setOrigin(0, 0)
      .setDisplaySize(130, 100)
      .setRotation(Phaser.Math.DegToRad(90));
    this.scene.physics.add.existing(this.rightDoor, true);
    this.rightDoor.body.setSize(80, 50);
    return this.rightDoor;
  }

  createDownDoor() {
    this.downDoor = this.scene.add
      .sprite(
        window.innerWidth / 2 - 75,
        window.innerHeight - 155,
        'basementDoor'
      )
      .setOrigin(0, 0)
      .setDisplaySize(130, 100)
      .setFlipY(true);
    this.scene.physics.add.existing(this.downDoor, true);
    this.downDoor.body.setSize(50, 80);
    return this.downDoor;
  }

  createLeftDoor() {
    this.leftDoor = this.scene.add
      .sprite(380, window.innerHeight / 2 + 70, 'basementDoor')
      .setOrigin(0, 0)
      .setDisplaySize(130, 100)
      .setRotation(Phaser.Math.DegToRad(270));
    this.scene.physics.add.existing(this.leftDoor, true);
    this.leftDoor.body.setSize(80, 50);
    return this.leftDoor;
  }
}
