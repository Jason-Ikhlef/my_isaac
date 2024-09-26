export default class Floor {
  constructor(scene, worldWidth, worldHeight) {
    this.scene = scene;
    this.createQuarters(worldWidth, worldHeight);
  }

  createQuarters(worldWidth, worldHeight) {
    this.scene.add
      .sprite(worldWidth / 7, 0, 'basement')
      .setOrigin(0, 0)
      .setDisplaySize(worldWidth / 2, worldHeight / 2);

    this.scene.add
      .sprite(worldWidth / 2, 0, 'basement')
      .setOrigin(0, 0)
      .setDisplaySize(worldWidth / 3, worldHeight / 2)
      .setFlipX(true);

    this.scene.add
      .sprite(worldWidth / 7, worldHeight / 2, 'basement')
      .setOrigin(0, 0)
      .setDisplaySize(worldWidth / 2, worldHeight / 2)
      .setFlipY(true);

    this.scene.add
      .sprite(worldWidth / 2, worldHeight / 2, 'basement')
      .setOrigin(0, 0)
      .setDisplaySize(worldWidth / 3, worldHeight / 2)
      .setFlipX(true)
      .setFlipY(true);
  }
}
