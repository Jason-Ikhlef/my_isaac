import GameScene from "./scenes/GameScene.js";

export const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: GameScene,
    physics: {
        default: "arcade",
    },
};
