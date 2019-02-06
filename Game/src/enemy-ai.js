// Internal enemy variables
const speed = 20;

export function enemyMovement(enemy, player) {
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