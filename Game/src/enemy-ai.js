// Enemy AI file
import { currentBlock } from './generic-functions.js';

// Internal enemy variables
const speed = 50;

export function enemyMovement(enemy, player, terrainMatrix) {

    const coord = currentBlock(enemy.x, enemy.y);
    const dest = currentBlock(player.x, player.y);

    // Recalculate path to player
    const visited = new Array(terrainMatrix.length);
    for (let i = 0; i < terrainMatrix.length; i++) {
        visited[i] = new Array(terrainMatrix[i].length);
    }
    const queue = new Array(); // shift --> dequeue, push --> enqueue
    queue.push(coord);

    let currentCoord;
    while((currentCoord = queue.shift()) !== undefined) {
        
    }
    

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