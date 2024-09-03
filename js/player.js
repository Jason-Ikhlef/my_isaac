export function createPlayer(scene) {
    const player = scene.physics.add.sprite(
        window.innerWidth / 2,
        window.innerHeight / 2,
        "dude"
    );
    player.setCollideWorldBounds(true);
    return player;
}
