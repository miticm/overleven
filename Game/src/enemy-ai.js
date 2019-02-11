// Enemy AI file
import {
    currentBlock
} from './generic-functions.js';
import {
    BLOCK_SIZE,
    WIDTH,
    HEIGHT,
    BLOCK_WIDTH,
    BLOCK_HEIGHT,
    HALF_BLOCK
} from './constants.js';

export function enemyMovement(enemy, player, terrainMatrix, speed) {
    const coord = currentBlock(enemy.x, enemy.y);
    const originalCoord = currentBlock(enemy.x, enemy.y);
    const dest = currentBlock(player.x, player.y);
    let finalDest = dest;

    // Recalculate path to player
    const visited = {};
    const queue = new Array(); // shift --> dequeue, push --> enqueue
    queue.push(coord);

    let currentCoord;
    while ((currentCoord = queue.shift()) !== undefined) {
        if (currentCoord == undefined) {
            break;
        }
        if (currentCoord.x == dest.x && currentCoord.y == dest.y) {
            let tempCoord = currentCoord;
            while (tempCoord.x != originalCoord.x || tempCoord.y != originalCoord.y) {
                tempCoord = visited[tempCoord.x][tempCoord.y];
                const v = visited[tempCoord.x][tempCoord.y];
                if (v == undefined) {
                    // tempCoord = dest;
                } else if (v.x == originalCoord.x && v.y == originalCoord.y) {
                    finalDest = tempCoord;
                    break;
                }
            }
            break;
        }
        const possibilities = enumerateNeighbors(currentCoord, visited, terrainMatrix);
        if (possibilities.right != undefined) {
            queue.push(possibilities.right);
        }
        if (possibilities.left != undefined) {
            queue.push(possibilities.left);
        }
        if (possibilities.up != undefined) {
            queue.push(possibilities.up);
        }
        if (possibilities.down != undefined) {
            queue.push(possibilities.down);
        }
    }

    // Move towards next block in
    if (finalDest.x == dest.x && finalDest.y == dest.y) {
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
    } else {
        if (enemy.x < (finalDest.x * BLOCK_SIZE) + 16 && (finalDest.x * BLOCK_SIZE) + 16 <= HEIGHT) {
            enemy.setVelocityX(speed);
        } else if (enemy.x > (finalDest.x * BLOCK_SIZE) + 16 && (finalDest.x * BLOCK_SIZE) + 16 >= 0) {
            enemy.setVelocityX(-speed);
        }

        if (enemy.y < (finalDest.y * BLOCK_SIZE) + 16 && (finalDest.y * BLOCK_SIZE) + 16 <= WIDTH) {
            enemy.setVelocityY(speed);
        } else if (enemy.y > (finalDest.y * BLOCK_SIZE) + 16 && (finalDest.y * BLOCK_SIZE) + 16 >= 0) {
            enemy.setVelocityY(-speed);
        }
    }

}

function enumerateNeighbors(currentCoord, visited, terrainMatrix) {
    const ret = {};
    // Up
    if (currentCoord.y - 1 >= 0 &&
        (!visited[currentCoord.x] || !visited[currentCoord.x][currentCoord.y - 1]) &&
        (!terrainMatrix[currentCoord.x] || !terrainMatrix[currentCoord.x][currentCoord.y - 1])) {
        ret.up = {
            x: currentCoord.x,
            y: currentCoord.y - 1
        }
        addVisited(visited, currentCoord.x, currentCoord.y - 1, currentCoord.x, currentCoord.y);
    }
    // Down
    if (currentCoord.y + 1 <= BLOCK_WIDTH &&
        (!visited[currentCoord.x] || !visited[currentCoord.x][currentCoord.y + 1]) &&
        (!terrainMatrix[currentCoord.x] || !terrainMatrix[currentCoord.x][currentCoord.y + 1])) {
        ret.down = {
            x: currentCoord.x,
            y: currentCoord.y + 1
        }
        addVisited(visited, currentCoord.x, currentCoord.y + 1, currentCoord.x, currentCoord.y);
    }
    // Left
    if ((currentCoord.x - 1) >= 0 &&
        (!visited[currentCoord.x - 1] || !visited[currentCoord.x - 1][currentCoord.y]) &&
        (!terrainMatrix[currentCoord.x - 1] || !terrainMatrix[currentCoord.x - 1][currentCoord.y])) {
        ret.left = {
            x: (currentCoord.x - 1),
            y: currentCoord.y
        }
        addVisited(visited, currentCoord.x - 1, currentCoord.y, currentCoord.x, currentCoord.y);
    }
    // Right
    const right_x = currentCoord.x + 1;
    if (right_x <= BLOCK_HEIGHT &&
        (!visited[right_x] || !visited[right_x][currentCoord.y]) &&
        (!terrainMatrix[right_x] || !terrainMatrix[right_x][currentCoord.y])) {
        ret.right = {
            x: right_x,
            y: currentCoord.y
        }
        addVisited(visited, currentCoord.x + 1, currentCoord.y, currentCoord.x, currentCoord.y);
    }
    return ret;
}

function addVisited(visited, x, y, prevX, prevY) {
    if (!Boolean(visited[x])) {
        visited[x] = {};
    }
    const obj = visited[x];
    obj[y] = {
        x: prevX,
        y: prevY
    };
}