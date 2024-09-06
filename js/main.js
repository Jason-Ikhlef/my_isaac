import { config } from './config.js';
import TitleScene from '../js/scenes/TitleScene.js';
import GameScene from '../js/scenes/GameScene.js';

config.scene = [TitleScene, GameScene];

window.addEventListener('load', () => {
    new Phaser.Game(config);
});
