import Player from '../player.js';
import { createAnimations } from '../animations.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.scenesStatus = {};
    this.currentRoom = 'SpawnRoom';
    this.isPause = false;
    this.musicLevel =
      localStorage.getItem('musicLevel') !== null
        ? parseInt(localStorage.getItem('musicLevel'))
        : 5;
    this.musicVolume = this.musicLevel / 10;
    this.sfxLevel =
      localStorage.getItem('sfxLevel') !== null
        ? parseInt(localStorage.getItem('sfxLevel'))
        : 5;
    this.sfxVolume = this.sfxLevel / 10;
    this.isOnOptionMenu = false;
    this.call = 0;
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
    this.load.image('upAndDownDoor', 'assets/floors/upAndDownDoor.png');
    this.load.image('rightAndLeftDoor', 'assets/floors/rightAndLeftDoor.png');
    this.load.audio('doorClose', 'sounds/sfx/door_close.wav');
    this.load.audio('doorOpen', 'sounds/sfx/door_open.wav');

    this.load.image('spikes', 'assets/floors/spikes.png');
    this.load.image('rock', 'assets/floors/rock.png');
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
    this.load.image('spawnControls', 'assets/floors/controls.png');

    this.load.audio('isaac_hurt_1', 'sounds/sfx/isaac_hurt_1.wav');
    this.load.audio('isaac_hurt_2', 'sounds/sfx/isaac_hurt_2.wav');
    this.load.audio('isaac_hurt_3', 'sounds/sfx/isaac_hurt_3.wav');
    this.load.audio('isaac_die_1', 'sounds/sfx/isaac_die_1.wav');
    this.load.audio('isaac_die_2', 'sounds/sfx/isaac_die_2.wav');
    this.load.audio('isaac_die_3', 'sounds/sfx/isaac_die_3.wav');
    this.load.audio('isaac_heal', 'sounds/sfx/isaac_heal.wav');
    this.load.audio('basement_music', 'sounds/musics/dipteraSonata.ogg');
    this.load.image('tears', 'assets/characters/tears.png');
    this.load.image('homing_tears', 'assets/characters/homing_tears.png');
    this.load.image('nails_tears', 'assets/characters/nails_tears.png');
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
    this.basement_music = this.sound.add('basement_music', {
      loop: true,
      volume: this.musicVolume,
    });
    this.basement_music.play();

    this.player = new Player(this);

    this.applyVolumes();
    this.changeRoom('SpawnRoom');
    createAnimations(this);

    this.input.keyboard.on('keydown-ESC', () => this.togglePause(), this);

    this.scene.launch('FadeOverlayScene');
    this.fadeOverlay = this.scene.get('FadeOverlayScene');

    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.isHoldingR = false;
    this.holdTime = 0;
  }

  applyVolumes() {
    if (this.basement_music) {
      this.basement_music.setVolume(this.musicVolume);
    }

    this.events.emit('volumeChanged', this.sfxVolume);
  }

  updateVolume(type, value) {
    if (type === 'music') {
      this.musicLevel = value;
      this.musicVolume = value / 10;
      localStorage.setItem('musicLevel', value);
    } else if (type === 'sfx') {
      this.sfxLevel = value;
      this.sfxVolume = value / 10;
      localStorage.setItem('sfxLevel', value);
    }

    this.applyVolumes();
  }

  changeRoom(
    newRoomKey,
    currentRoom = null,
    spawnPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  ) {
    const newScene = this.scene.get(newRoomKey);

    this.player.changeScene(newScene, spawnPosition);
    this.scene.bringToTop(newRoomKey);

    if (this.scenesStatus[newRoomKey]) {
      if (currentRoom) {
        this.scene.pause(currentRoom);
      }

      this.scene.resume(newRoomKey);
      this.scene.get(newRoomKey).handleResume();
    } else {
      if (currentRoom) {
        this.scene.pause(currentRoom);
      }

      this.scenesStatus[newRoomKey] = true;
      this.scene.launch(newRoomKey, {
        player: this.player,
        spawnPosition,
      });
    }

    this.currentRoom = newRoomKey;
    this.scene.bringToTop('FadeOverlayScene');
  }

  update(time, delta) {
    this.player.update();

    if (this.rKey.isDown) {
      if (!this.isHoldingR) {
        this.isHoldingR = true;
        this.holdTime = 0;

        this.fadeOverlay.resetOverlay();
      } else {
        this.holdTime += delta;
        const progress = Phaser.Math.Clamp(this.holdTime / 3000, 0, 1);

        this.fadeOverlay.overlay.clear();
        this.fadeOverlay.overlay.fillStyle(0x000000, progress);
        this.fadeOverlay.overlay.fillRect(
          0,
          0,
          window.innerWidth,
          window.innerHeight
        );

        if (this.holdTime >= 3000) {
          this.rKey.enabled = false;
          this.togglePause();
          localStorage.setItem('skipTitle', 'true');
          location.reload();

          this.holdTime = 0;
        }
      }
    } else {
      if (this.isHoldingR) {
        this.isHoldingR = false;
        this.holdTime = 0;

        this.fadeOverlay.resetOverlay();
      }
    }
  }

  togglePause(restart = false) {
    if (this.currentRoom === 'DeathScene' || this.isOnOptionMenu) return;
    if (!this.isPause && !restart) {
      this.scene.pause(this.currentRoom);
      this.scene.launch('PauseScene');
      this.scene.bringToTop('PauseScene');
    } else {
      this.scene.resume(this.currentRoom);
      this.scene.stop('PauseScene');
    }

    this.scene.bringToTop('FadeOverlayScene');

    this.isPause = !this.isPause;
  }

  onPlayerDeath() {
    this.scene.pause(this.currentRoom);
    this.currentRoom = 'DeathScene';
    this.scene.launch('DeathScene');
    this.scene.bringToTop('DeathScene');
    this.scene.bringToTop('FadeOverlayScene');
  }
}
