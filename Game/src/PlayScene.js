import { enemyMovement } from './enemy-ai.js';
import { BLOCK_SIZE, BLOCK_WIDTH, BLOCK_HEIGHT } from './constants.js';
import { currentBlock } from './generic-functions.js';

var PlayScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function PlayScene(){
        Phaser.Scene.call(this, { key: 'PlayScene' });
        window.GAME = this;
        // player related variables
        this.player;
        this.controls;
        this.cooldown = -1;
        this.playerSpeed = 140;

        // Enemy related variables
        this.enemies = [ ];
        this.terrainMatrix;
        this.waveCount = 0;
        this.enemieDestinations = [ ];

    },


// Function is ran before load, basically loads in all assets
preload: function() {
    this.load.image('grass', 'assets/grass.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('player', 'assets/player.png')
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('enemy', 'assets/enemy.png');
},

// Function is ran at start of game, initialize all sprites and math
create: function() {
    // Calculations for shooting angle
    const BetweenPoints = Phaser.Math.Angle.BetweenPoints;
    const SetToAngle = Phaser.Geom.Line.SetToAngle;
    const velocityFromRotation = this.physics.velocityFromRotation;
    const velocity = new Phaser.Math.Vector2();
    const line = new Phaser.Geom.Line();

    // Add background
    const grass = this.add.image(400, 300, 'grass');

    // Add player
    this.player = this.physics.add.sprite(24, 24, 'player');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);

    // Populate terrain matrix for AI
    this.initTerrainMatrix();

    // Add grounds
    const grounds = this.physics.add.staticGroup();
    
    //this is breaking everythin
    /*this.addBlock.call(this, grounds, 9, 9);
    this.addBlock.call(this, grounds, 9, 10);
    this.addBlock.call(this, grounds, 10, 9);
    this.addBlock.call(this, grounds, 10, 10);
    this.physics.add.collider(this.player, grounds);

    // Add enemy
    const enemy = this.addEnemy.call(this, 300, 300);
    this.physics.add.collider(enemy, grounds);

    const enemy2 = this.addEnemy.call(this, 100, 100);
    this.physics.add.collider(enemy2, grounds);
    this.physics.add.collider(enemy2, enemy);*/

    // Controls
    this.controls = this.input.keyboard.createCursorKeys();
    this.input.on('pointermove', function (pointer) {
        const angle = BetweenPoints(this.player, pointer);
        SetToAngle(line, this.player.x, this.player.y, angle, 128);
        velocityFromRotation(angle, 600, velocity);
    }, this);
    this.input.on('pointerup', function () {
        if (this.cooldown <= 0) {
            const bullet = this.physics.add.sprite(this.player.x, this.player.y, 'bullet');
            bullet.enableBody(true, this.player.x, this.player.y, true, true).setVelocity(velocity.x, velocity.y);
            this.cooldown = 20;
            this.physics.add.overlap(bullet, grounds, this.breakGround, null, this);
            for (let i = 0; i < this.enemies.length; i++) {
                this.physics.add.overlap(bullet, this.enemies[i].enemy, this.hitEnemy, null, this);
            }
        }
    }, this);
},

// Function is ran every frame to update the game
update: function() {
    this.playerMove();
    this.cooldown -= 1;
    this.moveEnemies();
    // this.cameras.main.centerOn(this.player.x, this.player.y);
},

// Moves the player
playerMove: function() {
    // Left/right
    if (this.controls.left.isDown) {
        this.player.setVelocityX(-this.playerSpeed);
    } else if (this.controls.right.isDown) {
        this.player.setVelocityX(this.playerSpeed);
    } else {
        this.player.setVelocityX(0);
    }

    // Down/up
    if (this.controls.up.isDown) {
        this.player.setVelocityY(-this.playerSpeed);
    } else if (this.controls.down.isDown) {
        this.player.setVelocityY(this.playerSpeed);
    } else {
        this.player.setVelocityY(0);
    }
},

// Moves enemies
moveEnemies: function() {
    this.enemies.forEach(function(enemy) {
        enemyMovement(enemy.enemy, this.player, this.terrainMatrix, enemy.speed);
    });
},

// Collision bullet --> ground
breakGround: function(bullet, ground) {
    bullet.disableBody(true, true);
    ground.disableBody(true, true);
    const coord = currentBlock(ground.x, ground.y);
    this.terrainMatrix[coord.x][coord.y] = false;
},

// Initializes the terrain matrix for AI pathing
initTerrainMatrix: function() {
    const outer = BLOCK_HEIGHT;
    const inner = BLOCK_WIDTH;
    this.terrainMatrix = new Array(outer);
    for (let i = 0; i < outer; i++) {
        this.terrainMatrix[i] = new Array(inner);
    }
},

// Adds a block in the game and into the matrix for AI pathing
addBlock: function(group, x, y) {
    group.create(x * BLOCK_SIZE + 8, y * BLOCK_SIZE + 8, 'ground');
    this.terrainMatrix[x][y] = true;
},

hitEnemy: function(bullet, enemy) {
    bullet.disableBody(true, true);
    console.log(bullet);
    const found = this.enemies.find(function(e) {
        return e.enemy == enemy;
    });
    console.log(found);
    found.hp -= 1;
    if (found.hp <= 0) {
        enemy.disableBody(true, true);
    }
},

addEnemy: function(x, y) {
    const enemy = this.physics.add.sprite(x, y, 'enemy');
    console.log(enemy);
    this.enemies.push({
        enemy: enemy,
        hp: 2,
        speed: 50
    });
    return enemy;
}
 
});

export default PlayScene;