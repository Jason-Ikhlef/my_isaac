export default class Borders {
  constructor(scene, worldWidth, worldHeight) {
    this.scene = scene;
    this.createBorders(worldWidth, worldHeight);
  }

  createBorders(worldWidth, worldHeight) {
    this.borderTop = this.scene.add.rectangle(
      worldWidth / 2,
      worldHeight * 0.12,
      worldWidth,
      10,
      0x000000
    );
    this.scene.physics.add.existing(this.borderTop, true);
    this.scene.bordersGroup.add(this.borderTop);

    this.borderBottom = this.scene.add.rectangle(
      worldWidth / 2,
      worldHeight * 0.88,
      worldWidth,
      10,
      0x000000
    );
    this.scene.physics.add.existing(this.borderBottom, true);
    this.scene.bordersGroup.add(this.borderBottom);

    this.borderLeft = this.scene.add.rectangle(
      worldWidth * 0.248,
      worldHeight / 2,
      10,
      worldHeight,
      0x000000
    );
    this.scene.physics.add.existing(this.borderLeft, true);
    this.scene.bordersGroup.add(this.borderLeft);

    this.borderRight = this.scene.add.rectangle(
      worldWidth * 0.764,
      worldHeight / 2,
      10,
      worldHeight,
      0x000000
    );
    this.scene.physics.add.existing(this.borderRight, true);
    this.scene.bordersGroup.add(this.borderRight);

    this.borderTop.setAlpha(0);
    this.borderBottom.setAlpha(0);
    this.borderLeft.setAlpha(0);
    this.borderRight.setAlpha(0);
  }
}
