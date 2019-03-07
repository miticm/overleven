// Game scene
import "phaser";
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
import {
  InfoScene
} from "./info";

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
  preload: function () {
    this.load.image("pause_button", "assets/pause_button.png");
    this.load.image("shop_button", "assets/shop_button.png");
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
let cooldown = 0;
let eActive = 0;
let wActive = 0;
let rActive = 0;
let rCharges = 3;
let qCooldown = 0;
let wCooldown = 0;
let eCooldown = 0;
let rCooldown = 0;
let playerSpeed = 140;
let maxPlayerSpeed = 400;
let inv = 30;
export let hp = 20;
export let gold = 0;
export let maxHealth = 20;
export let enemyCount = 2;
let qDmg = 1;
let dmgPrice = 50;
let potPrice = 50;

// Enemy related variables
let enemies = [];
let terrainMatrix;
let waveCount = 1;

// Movement variable
var target = new Phaser.Math.Vector2();

// Sounds
export let deathSound;
export let bombSound;
let bombOne = true;
export let damageSound;
export let fireSound;
export let newLevelSound;
export let rockSound;
let shopSound;
export let healthSound;
export let speedSound;
export let portSound;

// Function is ran at start of game, initialize all sprites and math
function create() {

  // Sounds
  deathSound = this.sound.add('die');
  bombSound = this.sound.add('bomb');
  damageSound = this.sound.add('damage');
  fireSound = this.sound.add('fire');
  newLevelSound = this.sound.add('newLevel');
  rockSound = this.sound.add('rock');
  speedSound = this.sound.add('speed');
  healthSound = this.sound.add('health');
  portSound = this.sound.add('port');

  // Calculations for shooting angle
  const BetweenPoints = Phaser.Math.Angle.BetweenPoints;
  const SetToAngle = Phaser.Geom.Line.SetToAngle;
  const velocityFromRotation = this.physics.velocityFromRotation;
  const velocity = new Phaser.Math.Vector2();
  const line = new Phaser.Geom.Line();
  initVariables.call(this);

  let shopScence = this.scene.get("shop");

  //add pauseButton
  let pauseButton = this.add
    .sprite(
      this.game.renderer.width - 50,
      this.game.renderer.height - 50,
      "pause_button"
    )
    .setDepth(1);
  pauseButton.setScale(0.1, 0.1);
  pauseButton.setInteractive();

  pauseButton.on("pointerover", () => {
    //make play button bloom
    pauseButton.setScale(0.12, 0.12);
  });
  pauseButton.on("pointerout", () => {
    //reset button bloom
    pauseButton.setScale(0.1, 0.1);
  });

  pauseButton.on("pointerup", () => {
    this.scene.launch("pause");
    this.scene.pause("game");
  });

  //add shop button
  let shopButton = this.add
    .sprite(
      this.game.renderer.width - 105,
      this.game.renderer.height - 50,
      "shop_button"
    )
    .setDepth(1);
  shopButton.setScale(0.1, 0.1);
  shopButton.setInteractive();

  shopButton.on("pointerover", () => {
    //make play button bloom
    shopButton.setScale(0.12, 0.12);
  });
  shopButton.on("pointerout", () => {
    //reset button bloom
    shopButton.setScale(0.1, 0.1);
  });

  shopButton.on("pointerup", () => {
    this.scene.launch('shop');
    this.scene.pause('game');
    
    // enemies = [];
    // terrainMatrix = undefined;
    //go to next scene
  });

  //update variables in game
  shopScence.events.on(
    "goldByShield",
    function () {
      gold -= 200;
      maxHealth += 10
    },
    this
  );
  shopScence.events.on(
    "goldBySpeed",
    function () {
      gold -= 100;
      maxPlayerSpeed += 100;
    },
    this
  );
  shopScence.events.on(
    "goldByDmg",
    function() {
      gold -= dmgPrice;
      dmgPrice *= 3;
      qDmg = waveCount;
    },
    this
  );
  shopScence.events.on(
    "goldByPot",
    function() {
      gold -= potPrice;
      potPrice += 50;
      hp = maxHealth;
    },
    this
  );

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

  //Mine explosion animation
  this.anims.create({
    key: "explode",
    frames: this.anims.generateFrameNumbers("mine", {
      start: 0,
      end: 4
    }),
    frameRate: 12,
    hideOnComplete: true
  });

  // Populate terrain matrix for AI
  initTerrainMatrix();

  // Add grounds
  const grounds = this.physics.add.staticGroup();

  addBlock.call(this, grounds, 9, 1);
  addBlock.call(this, grounds, 5, 1);
  addBlock.call(this, grounds, 9, 4);
  addBlock.call(this, grounds, 5, 4);
  addBlock.call(this, grounds, 9, 9);
  addBlock.call(this, grounds, 5, 9);
  addBlock.call(this, grounds, 9, 5);
  addBlock.call(this, grounds, 5, 5);
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
    "pointerdown",
    function (pointer) {
      target.x = pointer.x;
      target.y = pointer.y;

      Scene.physics.moveToObject(player, target, playerSpeed);
    },
    this
  );
  this.input.keyboard.on(
    "keydown_Q",
    function (event) {
      if (qCooldown <= 0) {
        //create the fireball
        const fireball = this.physics.add.sprite(
          player.x,
          player.y,
          "fireball"
        );
        Scene.events.emit("fireSound");
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
        qCooldown = 100;
      } else {
        // Q is on cooldown
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
        mine.enableBody(true, player.x, player.y, true, true);

        this.physics.add.overlap(mine, grounds, breakGround, null, this);
        this.physics.add.overlap(mine, player, mineTrip, null, this);
        wCooldown = 1000;
        wActive = 150;
      } else {
        // W is on cooldown
      }
    },
    this
  );
  this.input.keyboard.on(
    "keydown_E",
    function (event) {
      if (eCooldown <= 0) {
        eActive = 300;
        eCooldown = 1000;
      } else {
        // E is on cooldown
      }
    },
    this
  );
  this.input.keyboard.on(
    "keydown_R",
    function (event) {
      if (rCooldown <= 0 || (rActive > 0 && rCharges > 0)) {
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
          Scene.events.emit("portSound");
          player.setVelocity(0);
        }
      } else {
        // R is on cooldown
      }
    },
    this
  );

  this.scene.add("info", InfoScene, true);
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
  //distance tolerance
  var distance = Phaser.Math.Distance.Between(
    player.x,
    player.y,
    target.x,
    target.y
  );

  if (
    Math.abs(player.body.velocity.x) > 5 ||
    Math.abs(player.body.velocity.y) > 5
  ) {
    //check for distance tolerance
    if (distance < 4) {
      player.setVelocity(0);
    } else if (
      (player.body.velocity.x == 0 || player.body.velocity.y == 0) &&
      target.x != player.body.velocity.x &&
      target.y != player.body.velocity.y
    ) {
      Scene.physics.moveToObject(player, target, playerSpeed);
    }

    //animations
    if (
      player.body.velocity.y > 0 &&
      Math.abs(player.body.velocity.y) > Math.abs(player.body.velocity.x)
    ) {
      player.anims.play("down", true);
    } else if (
      player.body.velocity.y < 0 &&
      Math.abs(player.body.velocity.y) > Math.abs(player.body.velocity.x)
    ) {
      player.anims.play("up", true);
    } else if (player.body.velocity.x > 0) {
      player.anims.play("right", true);
    } else if (player.body.velocity.x < 0) {
      player.anims.play("left", true);
    } else if (player.body.velocity.x > 0) {
      player.anims.play("right", true);
    } else if (player.body.velocity.x < 0) {
      player.anims.play("left", true);
    }
  } else {
    player.setVelocity(0);
    player.anims.play("idle", true);
  }
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
  Scene.events.emit("rockSound");
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
        getRandomInt(WIDTH - 64),
        getRandomInt(HEIGHT - 64),
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
  if (playerSpeed < maxPlayerSpeed) {
    playerSpeed += 50;
  }
  Scene.events.emit("speedSound");
}

function increaseHealth(player, item) {
  item.disableBody(true, true);
  if (hp < maxHealth) {
    if (hp >= maxHealth - 5) {
      console.log(hp);
      console.log(maxHealth);
      hp = maxHealth;
      console.log(hp);
    } else {
      hp += 5;
    }
    Scene.events.emit("increaseHP");
  }
  Scene.events.emit("healthSound");
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
  hp = 20;
  mouseX = 0;
  mouseY = 0;
  moving = false;
  waveCount = 1;
  enemyCount = 2;
}

// Adds a block in the game and into the matrix for AI pathing
function addBlock(group, x, y) {
  group.create(x * BLOCK_SIZE, y * BLOCK_SIZE, "ground");
  if (terrainMatrix[x]) {
    terrainMatrix[x][y] = true;
  } else {
    terrainMatrix[x] = new Array(BLOCK_WIDTH);
  }
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
    if (
      DistanceBetween(
        fireball.x,
        fireball.y,
        enemies[i].enemy.x,
        enemies[i].enemy.y
      ) < 75
    ) {
      enemies[i].hp -= qDmg;
    }
    checkEnemiesDeath(i);
  }
}

function checkEnemiesDeath(i) {
  let newEnemy;
  //check if each enemy is dead
  if (enemies[i].hp <= 0) {
    Scene.events.emit("deathSound");
    enemies[i].enemy.disableBody(true, true);
    enemies.splice(i, 1);
    gold += 25;
    Scene.events.emit("increaseGold");
    enemyCount -= 1;
    if (enemyCount == 0) {
      waveCount++;

      Scene.events.emit("newLevelSound");

      //add enemies for next wave
      for (let i = 0; i < waveCount + 1; i++) {
        //spawn top
        if (i % 4 == 0) {
          newEnemy = addEnemy.call(Scene, getRandomInt(832), 64);
          Scene.physics.add.overlap(player, newEnemy, hitPlayer, null, Scene);
        }
        //spawn bottom
        else if (i % 4 == 1) {
          newEnemy = addEnemy.call(Scene, getRandomInt(832), 576);
          Scene.physics.add.overlap(player, newEnemy, hitPlayer, null, Scene);
        }
        //spawn left
        else if (i % 4 == 2) {
          newEnemy = addEnemy.call(Scene, 64, getRandomInt(576));
          Scene.physics.add.overlap(player, newEnemy, hitPlayer, null, Scene);
        }
        //spawn right
        else {
          newEnemy = addEnemy.call(Scene, 832, getRandomInt(576));
          Scene.physics.add.overlap(player, newEnemy, hitPlayer, null, Scene);
        }
        if (enemies.length > 1) {
          for (let j = 0; j < enemies.length - 1; j++) {
            Scene.physics.add.collider(enemies[j].enemy, newEnemy);
          }
        }
        enemyCount++;
      }

      //Scene.scene.remove("info");
      //Scene.scene.start("win");
    }
    Scene.events.emit("checkEnemiesDeath");
  }
}

function mineTrip(mine, player) {
  let thing = true;
  if (wActive <= 0) {
    mine.anims.play("explode", true);
    if (bombOne) {
      Scene.events.emit("bombSound");
      bombOne = false;
    }
    if (mine.visible == false) {
      mine.disableBody(true, true);
      bombOne = true;
    }
    const DistanceBetween = Phaser.Math.Distance.Between;

    //minus 3 health for enemies around
    for (let i = 0; i < enemies.length; i++) {
      if (
        DistanceBetween(
          mine.x,
          mine.y,
          enemies[i].enemy.x,
          enemies[i].enemy.y
        ) < 125
      ) {
        enemies[i].hp -= 1;
      }

      checkEnemiesDeath(i);
    }
  }
}

function hitPlayer(player, enemy) {
  if (inv <= 0) {
    hp -= 1;
    Scene.events.emit("damageSound");
    this.events.emit("reduceHP");
    if (hp <= 0) {
      this.scene.remove("info");
      this.scene.stop("game");
      this.scene.start("lose");
    }
    inv = 30;
  }
}

function addEnemy(x, y) {
  const enemy = this.physics.add.sprite(x, y, "enemy");
  enemies.push({
    enemy: enemy,
    hp: waveCount * 2,
    speed: 50 + waveCount * 2
  });
  enemy.anims.play("enemy", true);
  return enemy;
}

function stopPlayer(player, grounds) {
  player.x = this.game.renderer.width / 2;
  player.y = this.game.renderer.height / 2;
}