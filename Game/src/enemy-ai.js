// Enemy AI file
import { currentBlock } from './generic-functions.js';

// Internal enemy variables
const speed = 50;

export function enemyMovement(enemy, player, terrainMatrix) {

    const coord = currentBlock(enemy.x, enemy.y);
    const dest = currentBlock(player.x, player.y);

    // Recalculate path to player

    // Move on path
    if (enemy.x < player.x) {
        enemy.setVelocityX(speed);
    } else if (enemy.x > player.x) {
        enemy.setVelocityX(-speed);
    }

    if (enemy.y < player.y) {
        enemy.setVelocityY(speed);
    } else if (enemy.y > player.y) {
        enemy.setVelocityY(-speed);
    }
}