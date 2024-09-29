const items = [
  {
    name: '<3',
    texture: '<3',
    effect: (player) => {
      player.maxHearts += 1;
      player.health = Math.min(player.health + 2, player.maxHearts * 2);
      player.initHearts();
      player.updateHearts();
    },
  },
  {
    name: 'aries',
    texture: 'aries',
    effect: (player) => {
      player.movementSpeed *= 1.5;
    },
  },
];

export default items;
