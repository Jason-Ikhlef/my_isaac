import { config } from './config.js';
import GameScene from '../js/scenes/GameScene.js'

config.scene = [GameScene];

window.addEventListener('load', () => {
    new Phaser.Game(config);
});
