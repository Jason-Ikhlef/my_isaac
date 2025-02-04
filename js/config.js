import SpawnRoom from './scenes/SpawnRoom.js';
import FirstTopRoom from './scenes/FirstTopRoom.js';
import SecondTopRoom from './scenes/SecondTopRoom.js';
import ThirdTopRoom from './scenes/ThirdTopRoom.js';
import FirstRightRoom from './scenes/FirstRightRoom.js';
import SecondRightRoom from './scenes/SecondRightRoom.js';
import ItemRoom from './scenes/ItemRoom.js';
import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.js';
import PauseScene from './scenes/PauseScene.js';
import FadeOverlayScene from './scenes/FadeOverlayScene.js';
import DeathScene from './scenes/DeathScene.js';
import OptionsScene from './scenes/OptionsScene.js';
import BossRoom from './scenes/BossRoom.js';

export const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [
    TitleScene,
    GameScene,
    PauseScene,
    OptionsScene,
    SpawnRoom,
    FirstTopRoom,
    SecondTopRoom,
    ThirdTopRoom,
    FirstRightRoom,
    SecondRightRoom,
    ItemRoom,
    BossRoom,
    FadeOverlayScene,
    DeathScene,
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};
