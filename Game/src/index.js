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

const preloader = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function Preloader() {
    Phaser.Scene.call(this, { key: "preloader" });
  },
  preload: preload,

  create: function() {
    this.scene.start("MenuScene");
  }
});

const MenuScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function MenuScene() {
    Phaser.Scene.call(this, { key: "MenuScene" });
    window.GAME = this;
  },

  preload: function() {
    this.load.image("menu_background", "assets/background.jpg");
    this.load.image("play_button", "assets/play_button.png");
    this.load.image("leaderboard_button", "assets/leaderboard_button.png");
    this.load.image("game_title", "assets/game_title.png");
  },

  create: function() {
    let background = this.add.sprite(0, 0, "menu_background");
    background.setScale(1.7, 1.7);
    background.setOrigin(0, 0);

    this.add
      .sprite(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 100,
        "game_title"
      )
      .setDepth(1);

    let playButton = this.add
      .sprite(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 + 50,
        "play_button"
      )
      .setDepth(1);
    playButton.setInteractive();

    playButton.on("pointerover", () => {
      //make play button bloom
      playButton.setScale(1.5, 1.5);
    });

    playButton.on("pointerout", () => {
      //reset button bloom
      playButton.setScale(1, 1);
    });

    playButton.on("pointerup", () => {
      this.scene.start("game");
      //go to next scene
    });

    let leaderboardButton = this.add
      .sprite(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 + 130,
        "leaderboard_button"
      )
      .setDepth(1);
    leaderboardButton.setInteractive();

    leaderboardButton.on("pointerover", () => {
      //make button bloom
      leaderboardButton.setScale(1.5, 1.5);
    });

    leaderboardButton.on("pointerout", () => {
      //reset button bloom
      leaderboardButton.setScale(1, 1);
    });

    leaderboardButton.on("pointerup", () => {
      //go to leaderboard page
    });
  }
});

const win = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function win() {
    Phaser.Scene.call(this, { key: "win" });
  },

  create: function() {
    const text = this.add.text(WIDTH / 2, HEIGHT / 2, "You win!", {
      fontSize: "32px"
    });

    this.input.once(
      "pointerup",
      function(event) {
        this.scene.start("game");
        enemies = [];
        terrainMatrix = undefined;
      },
      this
    );
  }
});

const game = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function Game() {
    Phaser.Scene.call(this, { key: "game" });
    window.GAME = this;

    this.controls;
    this.track;
    this.text;
  },

  preload: preload,
  create: create,
  update: update
});

const lose = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function lose() {
    Phaser.Scene.call(this, { key: "lose" });
  },

  preload: function() {
    this.load.image("menu_button", "assets/menu_button.png");
    this.load.image("retry_button", "assets/retry_button.png");
  },

  create: function() {
    const text = this.add.text(WIDTH / 2, HEIGHT / 2, 'You lose...', {fontSize: '32px'});
    let menuButton = this.add.sprite(this.game.renderer.width * (4/5), this.game.renderer.height - 100, "menu_button").setDepth(1);
    menuButton.setScale(0.2, 0.2);
    menuButton.setInteractive();

    menuButton.on("pointerover", () => {
      //make play button bloom
      menuButton.setScale(0.3, 0.3);
    });
    menuButton.on("pointerout", () => {
      //reset button bloom
      menuButton.setScale(0.2, 0.2);
    });

    menuButton.on("pointerup", () => {
        this.scene.start("MenuScene");;
        enemies = [];
        terrainMatrix = undefined;
        //go to next scene
    })
    let retryButton = this.add.sprite(this.game.renderer.width / 7, this.game.renderer.height - 100, "retry_button").setDepth(1);
    retryButton.setScale(0.15, 0.15);
    retryButton.setInteractive();

    retryButton.on("pointerover", () => {
      //make play button bloom
      retryButton.setScale(0.25, 0.25);
    });
    retryButton.on("pointerout", () => {
      //reset button bloom
      retryButton.setScale(0.15, 0.15);
    });

    retryButton.on(
      "pointerup",
      function(event) {
        this.scene.start("game");
        enemies = [];
        terrainMatrix = undefined;
      },
      this
    );
  }
});

// Config and set up the game, in general don't mess with
var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: WIDTH,
  height: HEIGHT,
  scene: [preloader, MenuScene, game, win, lose],
  physics: {
    default: "arcade"
  }
};

// game variables
let start = new Phaser.Game(config);
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
let inv = 30;
let hp = 3;

// Enemy related variables
let enemies = [];
let terrainMatrix;
let enemyCount = 2;
let waveCount = 0;

// Function is ran before load, basically loads in all assets
function preload() {
  this.load.image("grass", "assets/grass.png");
  this.load.image("ground", "assets/sml_rock64.png");
  this.load.image("bullet", "assets/bullet.png");
  this.load.spritesheet("enemy", "assets/slime64.png", {
    frameWidth: 64,
    frameHeight: 64
  });
  this.load.image("boot", "assets/boot.png");
  this.load.image("firstaid", "assets/firstaid.png");
  //this.load.image("Q", "assets/qability.png");
  this.load.image("potion", "assets/potion.png");
  this.load.spritesheet("player", "assets/wizard64.png", {
    frameWidth: 64,
    frameHeight: 64
  });
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
  player = this.physics.add.sprite(
    this.game.renderer.width / 2,
    this.game.renderer.height / 2,
    "player"
  );
  player.setBounce(0.1);
  player.setCollideWorldBounds(true);

  // player animations
  this.anims.create({
    key: "idle",
    frames: [{ key: "player", frame: 0 }],
    frameRate: 0
  });

  this.anims.create({
    key: "down",
    frames: this.anims.generateFrameNumbers("player", { start: 1, end: 2 }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: "up",
    frames: this.anims.generateFrameNumbers("player", { start: 7, end: 8 }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("player", { start: 3, end: 4 }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("player", { start: 5, end: 6 }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: "enemy",
    frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 1 }),
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

  // Add enemy
  const enemy = addEnemy.call(this, 64, 64);
  // this.physics.add.collider(enemy, grounds);
  this.physics.add.overlap(player, enemy, hitPlayer, null, this);

  // const enemy2 = addEnemy.call(this, 100, 100);
  // this.physics.add.collider(enemy2, grounds);
  // this.physics.add.collider(enemy2, enemy);
  // this.physics.add.overlap(player, enemy2, hitPlayer, null, this);

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
  inv -= 1;
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
    player.anims.play("left", true);
  } else if (controls.right.isDown) {
    player.setVelocityX(playerSpeed);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
  }

  // Down/up
  if (controls.up.isDown) {
    player.setVelocityY(-playerSpeed);
    player.anims.play("up", true);
  } else if (controls.down.isDown) {
    player.setVelocityY(playerSpeed);
    player.anims.play("down", true);
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
        "potion"
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