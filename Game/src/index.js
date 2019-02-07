import "phaser";
import { enemyMovement } from "./enemy-ai.js";
import {
  HEIGHT,
  WIDTH,
  BLOCK_SIZE,
  BLOCK_WIDTH,
  BLOCK_HEIGHT
} from "./constants.js";
import { currentBlock, getRandomInt } from "./generic-functions.js";

// Config and set up the game, in general don't mess with
var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: WIDTH,
  height: HEIGHT,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: "arcade"
  }
};

// game variables
let game = new Phaser.Game(config);
let Scene;

// Declare variables
// Player related variables
let player;
let controls;
let cooldown = 0;
let playerSpeed = 140;

// Enemy related variables
let enemies = [];
let terrainMatrix;
let enemieDestinations = [];

// Function is ran before load, basically loads in all assets
function preload() {
  this.load.image("grass", "assets/grass.png");
  this.load.image("ground", "assets/ground.png");
  this.load.image("player", "assets/player.png");
  this.load.image("bullet", "assets/bullet.png");
  this.load.image("enemy", "assets/enemy.png");
  this.load.image("boot", "assets/boot.png");
  this.load.image("firstaid", "assets/firstaid.png");
}

// Function is ran at start of game, initialize all sprites and math
function create() {
  // Calculations for shooting angle
  const BetweenPoints = Phaser.Math.Angle.BetweenPoints;
  const SetToAngle = Phaser.Geom.Line.SetToAngle;
  const velocityFromRotation = this.physics.velocityFromRotation;
  const velocity = new Phaser.Math.Vector2();
  const line = new Phaser.Geom.Line();
  Scene = this;

  // Add background
  const grass = this.add.image(400, 300, "grass");

  // Add player
  player = this.physics.add.sprite(24, 24, "player");
  player.setBounce(0.1);
  player.setCollideWorldBounds(true);

  // Populate terrain matrix for AI
  initTerrainMatrix();

  // Add grounds
  const grounds = this.physics.add.staticGroup();

  addBlock.call(this, grounds, 9, 9);
  addBlock.call(this, grounds, 9, 10);
  addBlock.call(this, grounds, 10, 9);
  addBlock.call(this, grounds, 10, 10);
  this.physics.add.collider(player, grounds);

  // Add enemy
  const enemy = this.physics.add.sprite(300, 300, "enemy");
  enemies.push(enemy);
  this.physics.add.collider(enemy, grounds);
  enemy.setCollideWorldBounds(true);

  // Controls
  controls = this.input.keyboard.createCursorKeys();
  this.input.on(
    "pointermove",
    function(pointer) {
      const angle = BetweenPoints(player, pointer);
      SetToAngle(line, player.x, player.y, angle, 128);
      velocityFromRotation(angle, 600, velocity);
    },
    this
  );
  this.input.on(
    "pointerup",
    function() {
      if (cooldown <= 0) {
        const bullet = this.physics.add.sprite(player.x, player.y, "bullet");
        bullet
          .enableBody(true, player.x, player.y, true, true)
          .setVelocity(velocity.x, velocity.y);
        cooldown = 20;
        this.physics.add.overlap(bullet, grounds, breakGround, null, this);
      }
    },
    this
  );
}

// Function is ran every frame to update the game
function update() {
  playerMove();
  cooldown -= 1;
  moveEnemies();
  // this.cameras.main.centerOn(player.x, player.y);
}

// Moves the player
function playerMove() {
  // Left/right
  if (controls.left.isDown) {
    player.setVelocityX(-playerSpeed);
  } else if (controls.right.isDown) {
    player.setVelocityX(playerSpeed);
  } else {
    player.setVelocityX(0);
  }

  // Down/up
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
    enemyMovement(enemy, player, terrainMatrix);
  });
}

// Collision bullet --> ground
function breakGround(bullet, ground) {
  bullet.disableBody(true, true);
  ground.disableBody(true, true);
  const coord = currentBlock(ground.x, ground.y);
  terrainMatrix[coord.x][coord.y] = false;
  let iteminfo = generateItems();
  upgrageAttributes(iteminfo.id, iteminfo.item);
}

function generateItems() {
  let id = getRandomInt(2);
  let item;
  switch (id) {
    case 0:
      item = Scene.physics.add.staticImage(
        getRandomInt(WIDTH),
        getRandomInt(HEIGHT),
        "boot"
      );
      break;
    case 1:
      item = Scene.physics.add.staticImage(
        getRandomInt(WIDTH),
        getRandomInt(HEIGHT),
        "firstaid"
      );
      break;
  }
  return { id, item };
}

function upgrageAttributes(id, item) {
  if (id == 0) {
    Scene.physics.add.overlap(player, item, speedUp);
  }
  if (id == 1) {
    Scene.physics.add.overlap(player, item, increaseHealth);
  }
}
function speedUp(player, item) {
  item.disableBody(true, true);
  playerSpeed += 100;
}
function increaseHealth(player, item) {
  item.disableBody(true, true);
  console.log("increase health");
}

// Initializes the terrain matrix for AI pathing
function initTerrainMatrix() {
  const outer = BLOCK_HEIGHT;
  const inner = BLOCK_WIDTH;
  terrainMatrix = new Array(outer);
  for (let i = 0; i < outer; i++) {
    terrainMatrix[i] = new Array(inner);
  }
}

// Adds a block in the game and into the matrix for AI pathing
function addBlock(group, x, y) {
  group.create(x * BLOCK_SIZE + 8, y * BLOCK_SIZE + 8, "ground");
  terrainMatrix[x][y] = true;
}
