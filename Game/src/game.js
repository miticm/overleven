// Game scene
import 'phaser';
import {
  enemyMovement
} from "./enemy-ai.js";
import {
  currentBlock,
  getRandomInt
} from "./generic-functions.js";
import {
  HEIGHT,
  WIDTH,
  BLOCK_SIZE,
  BLOCK_WIDTH,
  BLOCK_HEIGHT
} from "./constants.js";

export const game = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function Game() {
    Phaser.Scene.call(this, {
      key: "game"
    });
    window.GAME = this;

    this.controls;
    this.track;
    this.text;
  },
  create: create,
  update: update
});

let Scene;
let mouseX = 0;
let mouseY = 0;
let moving = false;

// Declare variables
// Player related variables
let player;
let mouse;
let controls;
let eActive = 0;
let wActive = 0;
let rActive = 0;
let rCharges = 3;
let cooldown = 0;
let qCooldown = 0;
let wCooldown = 0;
let eCooldown = 0;
let rCooldown = 0;
let playerSpeed = 140;
let inv = 30;
let hp = 3;

// Enemy related variables
let enemies = [];
let terrainMatrix;
let enemyCount = 2;
let waveCount = 0;

// Function is ran at start of game, initialize all sprites and math
function create() {
  // Calculations for shooting angle
  const BetweenPoints = Phaser.Math.Angle.BetweenPoints;
  const SetToAngle = Phaser.Geom.Line.SetToAngle;
  const velocityFromRotation = this.physics.velocityFromRotation;
  const velocity = new Phaser.Math.Vector2();
  const line = new Phaser.Geom.Line();
  initVariables.call(this);

  // Add background
  this.add.image(WIDTH / 2, HEIGHT / 2, "grass");

  // Add player
  player = this.physics.add.sprite(
    this.game.renderer.width / 2,
    this.game.renderer.height / 2,
    "player"
  );
  player.setCollideWorldBounds(true);

  // player animations
  this.anims.create({
    key: "idle",
    frames: [{
      key: "player",
      frame: 0
    }],
    frameRate: 0
  });

  this.anims.create({
    key: "down",
    frames: this.anims.generateFrameNumbers("player", {
      start: 1,
      end: 2
    }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: "up",
    frames: this.anims.generateFrameNumbers("player", {
      start: 7,
      end: 8
    }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("player", {
      start: 3,
      end: 4
    }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("player", {
      start: 5,
      end: 6
    }),
    frameRate: 5,
    repeat: -1
  });

  // Slime enemy animation
  this.anims.create({
    key: "enemy",
    frames: this.anims.generateFrameNumbers("enemy", {
      start: 0,
      end: 1
    }),
    frameRate: 4,
    repeat: -1
  });

  // Player Ability Animation
  this.anims.create({
    key: "fireball",
    frames: this.anims.generateFrameNumbers("fireball", {
      start: 0,
      end: 1
    }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: "explode",
    frames: this.anims.generateFrameNumbers("mine", {
      start: 1,
      end: 4
    }),
    frameRate: 4,
    repeat: -1
  });

  // Populate terrain matrix for AI
  initTerrainMatrix();

  // Add grounds
  const grounds = this.physics.add.staticGroup();

  addBlock.call(this, grounds, 2, 2);
  addBlock.call(this, grounds, 2, 3);
  this.physics.add.collider(player, grounds);
  this.physics.add.overlap(player, grounds, stopPlayer, null, this);

  // Add enemy
  const enemy = addEnemy.call(this, 64, 64);
  this.physics.add.overlap(player, enemy, hitPlayer, null, this);

  const enemy2 = addEnemy.call(this, 256, 64);
  this.physics.add.collider(enemy2, enemy);
  this.physics.add.overlap(player, enemy2, hitPlayer, null, this);

  // Controls
  controls = this.input.keyboard.createCursorKeys();

  this.input.on(
    "pointermove",
    function (pointer) {
      mouse = pointer;
      const angle = BetweenPoints(player, pointer);
      SetToAngle(line, player.x, player.y, angle, 128);
      velocityFromRotation(angle, 600, velocity);
    },
    this
  );
  this.input.on(
    "pointerup",
    function (pointer) {
      mouseX = pointer.x;
      mouseY = pointer.y;
      moving = true;
      //OLD CODE FOR SHOOTING
      // if (cooldown <= 0) {
      //   const bullet = this.physics.add.sprite(player.x, player.y, "bullet");
      //   bullet
      //     .enableBody(true, player.x, player.y, true, true)
      //     .setVelocity(velocity.x, velocity.y);
      //   cooldown = 20;
      //   this.physics.add.overlap(bullet, grounds, breakGround, null, this);
      //   for (let i = 0; i < enemies.length; i++) {
      //     this.physics.add.overlap(
      //       bullet,
      //       enemies[i].enemy,
      //       hitEnemy,
      //       null,
      //       this
      //     );
      //   }
      // }
    },
    this
  );
  this.input.keyboard.on(
    'keydown_Q',
    function (event) {
      if (qCooldown <= 0) {
      //create the fireball
        const fireball = this.physics.add.sprite(player.x, player.y, "fireball");
        fireball
        .enableBody(true, player.x, player.y, true, true)
        .setVelocity(velocity.x, velocity.y);

        this.physics.add.overlap(fireball, grounds, breakGround, null, this);
        fireball.anims.play("fireball", true);
        for (let i = 0; i < enemies.length; i++) {
        this.physics.add.overlap(
        fireball,
        enemies[i].enemy,
        fireballHit,
        null,
        this
        );
      }


        console.log("Q");
        qCooldown = 600;
      } else {
        console.log("Q on Cooldown");
      }
    },
    this
  );
  this.input.keyboard.on(
    "keydown_W",
    function (event) {
      if (wCooldown <= 0) {
              //create the Mine
              const mine = this.physics.add.sprite(player.x, player.y, "mine");
              mine
              .enableBody(true, player.x, player.y, true, true)

              this.physics.add.overlap(mine, grounds, breakGround, null, this);
              this.physics.add.overlap(mine, player, mineTrip, null, this);

        console.log("W");
        wCooldown = 1000;
        wActive = 150;
      } else {
        console.log("W on Cooldown");
      }
    },
    this
  );
  this.input.keyboard.on(
    "keydown_E",
    function (event) {
      if (eCooldown <= 0) {
        console.log("E");
        eActive = 300;
        eCooldown = 1000;
      } else {
        console.log("E on Cooldown");
      }
    },
    this
  );
  this.input.keyboard.on(
    "keydown_R",
    function (event) {
      if (rCooldown <= 0 || (rActive > 0 && rCharges > 0)) {
        console.log(rCharges);
        if (rCharges == 3) {
          rActive = 800;
          rCooldown = 3000;
        }

        if (rActive > 0 && rCharges > 0) {
            rCharges -= 1;
            player.x = mouse.x;
            player.y = mouse.y;

            //make the player stay still
            moving = false;
            player.setVelocity(0);
        }
      } else {
        console.log("R on Cooldown");
      }
    },
    this
  );
}

// Function is ran every frame to update the game
function update() {
  playerMove();
  cooldowns();
  moveEnemies();
  // this.cameras.main.centerOn(player.x, player.y);
}

function cooldowns() {
  cooldown -= 1;
  qCooldown -= 1;
  wCooldown -= 1;
  eCooldown -= 1;
  rCooldown -= 1;
  eActive -= 1;
  rActive -= 1;
  wActive -= 1;
  inv -= 1;

  if (rCooldown <= 0) {
    rCharges = 3;
  }
}

// Moves the player
function playerMove() {

  if (moving) {

    if (player.x == mouseX && player.y == mouseY) {
      moving = false;
    } else {
      const tempXSpeed = Math.abs(mouseX - player.x) < playerSpeed ? Math.abs(mouseX - player.x) : playerSpeed;
      if (player.x > mouseX) {
        player.setVelocityX(-tempXSpeed);
        player.anims.play("left", true);
      } else if (player.x < mouseX) {
        player.setVelocityX(tempXSpeed);
        player.anims.play("right", true);
      } else {
        player.setVelocityX(0);
      }

      const tempYSpeed = Math.abs(mouseY - player.y) < playerSpeed ? Math.abs(mouseY - player.y) : playerSpeed;
      if (player.y > mouseY) {
        player.setVelocityY(-tempYSpeed);
        player.anims.play("up", true);
      } else if (player.y < mouseY) {
        player.setVelocityY(tempYSpeed);
        player.anims.play("down", true);
      } else {
        player.setVelocityY(0);
      }
    }
  }

  // OLD CODE FOR MOVING
  // Left/right
  // if (controls.left.isDown) {
  //   player.setVelocityX(-playerSpeed);
  //   player.anims.play("left", true);
  // } else if (controls.right.isDown) {
  //   player.setVelocityX(playerSpeed);
  //   player.anims.play("right", true);
  // } else {
  //   player.setVelocityX(0);
  // }

  // // Down/up
  // if (controls.up.isDown) {
  //   player.setVelocityY(-playerSpeed);
  //   player.anims.play("up", true);
  // } else if (controls.down.isDown) {
  //   player.setVelocityY(playerSpeed);
  //   player.anims.play("down", true);
  // } else {
  //   player.setVelocityY(0);
  // }
}

// Moves enemies
function moveEnemies() {
  if (eActive <= 0) {
    enemies.forEach(function (enemy) {
      enemyMovement(enemy.enemy, player, terrainMatrix, enemy.speed);
    });
  } else {
    enemies.forEach(function (enemy) {
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
        "potion"
      );
      break;
  }
  return {
    id,
    item
  };
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

// Called when game is created or recreated
function initVariables() {
  enemies = [];
  Scene = this;
  eActive = 0;
  wActive = 0;
  rActive = 0;
  rCharges = 3;
  cooldown = 0;
  qCooldown = 0;
  wCooldown = 0;
  eCooldown = 0;
  rCooldown = 0;
  playerSpeed = 140;
  inv = 30;
  hp = 3;
  mouseX = 0;
  mouseY = 0;
  moving = false;
  waveCount = 0;
  enemyCount = 2;
}

// Adds a block in the game and into the matrix for AI pathing
function addBlock(group, x, y) {
  group.create(x * BLOCK_SIZE + 8, y * BLOCK_SIZE + 8, "ground");
  terrainMatrix[x][y] = true;
}

function fireballHit(fireball, enemy) {
  fireball.disableBody(true, true);
  const DistanceBetween = Phaser.Math.Distance.Between;

  const found = enemies.find(function (e) {
    return e.enemy == enemy;
  });

  found.hp -= 2;

  //minus 3 health for enemies around
  for (let i = 0; i < enemies.length; i++) {

    if (DistanceBetween(fireball.x, fireball.y, enemies[i].enemy.x, enemies[i].enemy.y) < 75) {
      enemies[i].hp -= 1;
    }

    //check if each enemy is dead
    if (enemies[i].hp <= 0) {
      enemies[i].enemy.disableBody(true, true);
      enemyCount -= 1;
      if (enemyCount == 0) {
        this.scene.start("win");
      }
    }
  }
}

function mineTrip(mine, player) {
  if (wActive <= 0) {
    mine.anims.play("explode", true);
    mine.disableBody(true, true);
    const DistanceBetween = Phaser.Math.Distance.Between;

    //minus 3 health for enemies around
    for (let i = 0; i < enemies.length; i++) {
      if (DistanceBetween(mine.x, mine.y, enemies[i].enemy.x, enemies[i].enemy.y) < 125) {
        enemies[i].hp -= 3;
      }

      //check if each enemy is dead
      if (enemies[i].hp <= 0) {
        enemies[i].enemy.disableBody(true, true);
        enemyCount -= 1;
        if (enemyCount == 0) {
          this.scene.start("win");
        }
      }
    }
  }
}

function hitEnemy(bullet, enemy) {
  bullet.disableBody(true, true);
  console.log(bullet);
  const found = enemies.find(function (e) {
    return e.enemy == enemy;
  });
  console.log(found);
  found.hp -= 1;
  if (found.hp <= 0) {
    enemy.disableBody(true, true);
    enemyCount -= 1;
    if (enemyCount == 0) {
      this.scene.start("win");
    }
  }
}

function hitPlayer(player, enemy) {
  if (inv <= 0) {
    hp -= 1;
    if (hp <= 0) {
      this.scene.start("lose");
    }
    inv = 30;
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
  enemy.anims.play("enemy", true);
  return enemy;
}

function stopPlayer(player, grounds) {
  moving = false;
}
