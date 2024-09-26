import Player from '../player.js';
import { createAnimations } from '../animations.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.scenesStatus = {};
  }

  preload() {
    this.load.spritesheet('basement', 'assets/floors/Basement-Floor.png', {
      frameWidth: 233,
      frameHeight: 155,
    });

    this.load.spritesheet('basementDoor', 'assets/floors/Doors.png', {
      frameWidth: 50,
      frameHeight: 33,
    });

    this.load.spritesheet('hearts', 'assets/characters/hearts.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image('spikes', 'assets/floors/spikes.png');
    this.load.atlas(
      'head',
      'assets/characters/head.png',
      'assets/animations/head.json'
    );
    this.load.atlas(
      'body',
      'assets/characters/body.png',
      'assets/animations/body.json'
    );
    this.load.audio('isaac_hurt', 'sounds/sfx/isaac_hurt.wav');
    this.load.audio('basement_music', 'sounds/musics/dipteraSonata.ogg');
    this.load.image('tears', 'assets/characters/tears.png');
    this.load.audio('tears_fire', 'sounds/sfx/tears.wav');
    this.load.audio('tears_block', 'sounds/sfx/tear_block.wav');

    this.load.image('blood_tears', 'assets/monsters/blood_tears.png');

    this.load.audio('pooter_sound', 'sounds/sfx/pooter_sound.wav');
    this.load.audio('pooter_tears', 'sounds/sfx/pooter_tears.wav');
    this.load.audio('pooter_die', 'sounds/sfx/pooter_die.wav');
    this.load.atlas(
      'pooter',
      'assets/monsters/pooter.png',
      'assets/animations/pooter.json'
    );

    this.load.audio(
      'crazyLongLegs_tears',
      'sounds/sfx/crazyLongLegs_tears.wav'
    );
    this.load.audio('crazyLongLegs_die', 'sounds/sfx/crazyLongLegs_die.wav');
    this.load.atlas(
      'crazyLongLegs',
      'assets/monsters/crazyLongLegs.png',
      'assets/animations/crazyLongLegs.json'
    );
  }

  create() {
    const basement_music = this.sound.add('basement_music', {
      loop: true,
      volume: 0.1,
    });
    basement_music.play();

    this.player = new Player(this);

    this.changeRoom('SpawnRoom');
    createAnimations(this);
  }

  changeRoom(
    newRoomKey,
    currentRoom = null,
    spawnPosition = { x: null, y: null }
  ) {

    if (currentRoom) {
      currentRoom.player.destroy();
    }

    this.player.changeScene(this.scene.get(newRoomKey));
    
    if (this.scenesStatus[newRoomKey]) {
      console.log("new");
      this.scene.get(newRoomKey).onPlayerEnter(this.player, spawnPosition);
      this.scene.resume(newRoomKey);
      if (currentRoom) {
        this.scene.pause(currentRoom);
      }
    } else {
      if (currentRoom) {
        this.scene.pause(currentRoom);
      }
      this.scenesStatus[newRoomKey] = true;
      this.scene.launch(newRoomKey, { player: this.player, spawnPosition });
    }
  }

  update() {
    this.player.update();
  }
}