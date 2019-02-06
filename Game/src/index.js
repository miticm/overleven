import 'phaser';
import { enemyMovement } from './enemy-ai.js';

// Config and set up the game, in general don't mess with
var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    physics: {
        default: 'arcade'
    }
};
let game = new Phaser.Game(config);

// Declare variables
// Player related variables
let player;
let controls;
let cooldown = 0;
let playerSpeed = 140;

// Enemy related variables
let enemies = [];

// Function is ran before load, basically loads in all assets
function preload() {
    this.load.image('grass', 'assets/grass.png');
    this.load.image('stone', 'assets/stone.jpeg');
    this.load.spritesheet('player', 'assets/player_sheet.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('enemy', 'assets/enemy.jpg');
}

// Function is ran at start of game, initialize all sprites and math
function create() {
    const BetweenPoints = Phaser.Math.Angle.BetweenPoints;
    const SetToAngle = Phaser.Geom.Line.SetToAngle;
    const velocityFromRotation = this.physics.velocityFromRotation;
    const velocity = new Phaser.Math.Vector2();
    const line = new Phaser.Geom.Line();

    const grass = this.add.image(400, 300, 'grass');
    player = this.physics.add.sprite(20, 20, 'player');

    const stones = this.physics.add.staticGroup();
    stones.create(200, 200, 'stone').setScale(1);

    const enemy = this.physics.add.sprite(300, 300, 'enemy');
    enemies.push(enemy);

    this.physics.add.collider(player, stones);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    controls = this.input.keyboard.createCursorKeys();

    this.input.on('pointermove', function (pointer) {
        const angle = BetweenPoints(player, pointer);
        SetToAngle(line, player.x, player.y, angle, 128);
        velocityFromRotation(angle, 600, velocity);
    }, this);

    this.input.on('pointerup', function () {
        if (cooldown <= 0) {
            const bullet = this.physics.add.sprite(player.x, player.y, 'bullet');
            bullet.enableBody(true, player.x, player.y, true, true).setVelocity(velocity.x, velocity.y);
            cooldown = 20;
            this.physics.add.overlap(bullet, stones, breakGround, null, this);
        }
    }, this);
}

// Function is ran every frame to update the game
function update() {
    playerMove();
    cooldown -= 1;
    moveEnemies();
}

// Moves the player
function playerMove() {
    if (controls.left.isDown) {
        player.setVelocityX(-playerSpeed);
    } else if (controls.right.isDown) {
        player.setVelocityX(playerSpeed);
    } else {
        player.setVelocityX(0);
    }

    if (controls.up.isDown) {
        player.setVelocityY(-playerSpeed);
    } else if (controls.down.isDown) {
        player.setVelocityY(playerSpeed);
    } else {
        player.setVelocityY(0);
    }
}

// Moves enemies
function moveEnemies() {
    enemies.forEach(function(enemy) {
        enemyMovement(enemy, player);
    });
}

// Collision bullet --> ground
function breakGround(bullet, stone) {
    bullet.disableBody(true, true);
    stone.disableBody(true, true);
}