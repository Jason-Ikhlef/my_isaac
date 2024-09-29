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
  {
    name: 'spoon_bender',
    texture: 'spoon_bender',
    effect: (player) => {
      player.hasHoming = true;
    },
  },
  {
    name: 'nails',
    texture: 'nails',
    effect: (player) => {
      player.damage += 2;
      player.hasNails = true;
      player.knockback += 100;
    },
  },
];

export default items;
