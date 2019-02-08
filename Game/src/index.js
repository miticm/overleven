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
let mouse;
let controls;
let abilities;
let qActive = 0;
let rActive = 0;
let rCharges = 3;
let qKey;
let cooldown = 0;
let qCooldown = 0;
let wCooldown = 0;
let eCooldown = 0;
let rCooldown = 0;
let playerSpeed = 140;

// Enemy related variables
let enemies = [];
let terrainMatrix;
let waveCount = 0;
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
  //this.load.image("Q", "assets/qability.png");
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
  const enemy = addEnemy.call(this, 300, 300);
  this.physics.add.collider(enemy, grounds);

  const enemy2 = addEnemy.call(this, 100, 100);
  this.physics.add.collider(enemy2, grounds);
  this.physics.add.collider(enemy2, enemy);

  // Controls
  controls = this.input.keyboard.createCursorKeys();
  //abilities = this.input.keyboard.addKeys({ 'q': Phaser.Input.Keyboard.KeyCodes.Q, 'w': Phaser.Input.Keyboard.KeyCodes.W, 'e': Phaser.Input.Keyboard.KeyCodes.E, 'r': Phaser.Input.Keyboard.KeyCodes.R });
  qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

  this.input.on(
    "pointermove",
    function(pointer) {
      mouse = pointer;
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
        for (let i = 0; i < enemies.length; i++) {
          this.physics.add.overlap(
            bullet,
            enemies[i].enemy,
            hitEnemy,
            null,
            this
          );
        }
      }
    },
    this
  );
  this.input.keyboard.on(
    'keydown_Q',
    function(event) {
        if (qCooldown <= 0) {
            console.log("Q");
            qActive = 300;
            qCooldown = 1000;
        }
        else {
            console.log("Q on Cooldown");
        }
    },
    this
  );
  this.input.keyboard.on(
    "keydown_W",
    function(event) {
        if (wCooldown <= 0) {
            console.log("W");
            wCooldown = 1000;
        }
        else {
            console.log("W on Cooldown");
        }
    },
    this
  );
  this.input.keyboard.on(
    "keydown_E",
    function(event) {
        if (eCooldown <= 0) {
            console.log("E");
            eCooldown = 1000;
        }
        else {
            console.log("E on Cooldown");
        }
    },
    this
  );
  this.input.keyboard.on(
    "keydown_R",
    function(event) {
        if (rCooldown <= 0) {
            console.log("R");
            rActive = 800;
            
            if (rActive > 0 && rCharges > 0) {
                rCharges -= 1;
                player.disableBody(true, true);
                player = this.physics.add.sprite(mouse.x, mouse.y, "player");
            }
            else {
                rCooldown = 2200;
            }
        }
        else {
            console.log("R on Cooldown");
        }
    },
    this
  );
}

// Function is ran every frame to update the game
function update() {
  playerMove();
  cooldown -= 1;
  qCooldown -= 1;
  wCooldown -= 1;
  eCooldown -= 1;
  rCooldown -= 1;
  qActive -= 1;
  rActive -= 1;

  moveEnemies();
  // this.cameras.main.centerOn(player.x, player.y);
}

//reset the charges on R if the cooldown is up
if (rCooldown <= 0) {
    rCharges = 3;
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
    if (qActive <= 0) {
        enemies.forEach(function(enemy) {
        enemyMovement(enemy.enemy, player, terrainMatrix, enemy.speed);
        });
    }
    else {
        enemies.forEach(function(enemy) {
            enemyMovement(enemy.enemy, player, terrainMatrix, 0);
            });
    }
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

function hitEnemy(bullet, enemy) {
  bullet.disableBody(true, true);
  console.log(bullet);
  const found = enemies.find(function(e) {
    return e.enemy == enemy;
  });
  console.log(found);
  found.hp -= 1;
  if (found.hp <= 0) {
    enemy.disableBody(true, true);
  }
}

function addEnemy(x, y) {
  const enemy = this.physics.add.sprite(x, y, "enemy");
  console.log(enemy);
  enemies.push({
    enemy: enemy,
    hp: 2,
    speed: 50
  });
  return enemy;
}