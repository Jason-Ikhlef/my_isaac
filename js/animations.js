import Pooter from './pooter.js';

export function createAnimations(scene) {
  scene.anims.create({
    key: 'body_left',
    frames: scene.anims.generateFrameNames('body', {
      frames: [
        'body_0020',
        'body_0019',
        'body_0018',
        'body_0017',
        'body_0016',
        'body_0015',
        'body_0014',
        'body_0013',
        'body_0012',
        'body_0011',
        'body_0010',
      ],
    }),
    frameRate: 10,
    repeat: -1,
    yoyo: true,
  });

  scene.anims.create({
    key: 'body_right',
    frames: scene.anims.generateFrameNames('body', {
      prefix: 'body_',
      start: 1,
      end: 10,
      zeroPad: 4,
    }),
    frameRate: 10,
    repeat: -1,
    yoyo: true,
  });

  scene.anims.create({
    key: 'body_down',
    frames: scene.anims.generateFrameNames('body', {
      prefix: 'body_',
      start: 21,
      end: 30,
      zeroPad: 4,
    }),
    frameRate: 10,
    repeat: -1,
    yoyo: true,
  });

  scene.anims.create({
    key: 'body_up',
    frames: scene.anims.generateFrameNames('body', {
      prefix: 'body_',
      start: 21,
      end: 30,
      zeroPad: 4,
    }),
    frameRate: 10,
    repeat: -1,
    yoyo: true,
  });

  scene.anims.create({
    key: 'pooter_fly',
    frames: [
      { key: 'pooter', frame: 'pooter_0001' },
      { key: 'pooter', frame: 'pooter_0002' },
    ],
    frameRate: 8,
    repeat: -1,
    yoyo: true,
  });

  scene.anims.create({
    key: 'pooter_shoot',
    frames: scene.anims.generateFrameNames('pooter', {
      prefix: 'pooter_',
      start: 1,
      end: 14,
      zeroPad: 4,
    }),
    frameRate: 11,
    repeat: 0,
  });

  scene.anims.create({
    key: 'crazyLongLegs_move',
    frames: scene.anims.generateFrameNames('crazyLongLegs', {
      prefix: 'crazyLongLegs_',
      start: 1,
      end: 4,
      zeroPad: 4,
    }),
    frameRate: 8,
    repeat: -1,
    yoyo: true,
  });

  scene.anims.create({
    key: 'crazyLongLegs_shoot',
    frames: scene.anims.generateFrameNames('crazyLongLegs', {
      prefix: 'crazyLongLegs_',
      start: 5,
      end: 8,
      zeroPad: 4,
    }),
    frameRate: 4,
    repeat: 0,
  });
}
