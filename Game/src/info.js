import {
  hp,
  gold,
  maxHealth,
  enemyCount,
  fireSound,
  damageSound,
  bombSound,
  rockSound,
  deathSound,
  newLevelSound,
  speedSound,
  healthSound,
  portSound
} from "./game";

let muted = false;

export class InfoScene extends Phaser.Scene {
  constructor() {
    super({
      key: "info",
      active: false
    });
    this.hp = hp;
    this.gold = gold;
    this.maxHealth = maxHealth;
    this.enemiesRemaining = enemyCount;
    this.muted = false;
  }

  create() {
    let info = this.add.text(10, 10, `HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`, {
      font: "22px Arial",
      fill: "#fff000"
    });

    let sound = this.add.text(800, 10, 'Mute', {
      font: "22px Arial",
      fill: "#fff000"
    });
    sound.setInteractive();

    //  Grab a reference to the Game Scene
    let game = this.scene.get("game");
    let shop = this.scene.get("shop");
    let dmgPrice = 50;
    let potPrice = 50;

    // //  Listen for events from it
    game.events.on(
      "reduceHP",
      function () {
        this.hp -= 1;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    );

    game.events.on(
      "increaseHP",
      function () {
        this.hp = hp;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    );

    game.events.on(
      "checkEnemiesDeath",
      function () {
        this.enemiesRemaining = enemyCount;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    )

    game.events.on(
      "increaseGold",
      function () {
        this.gold += 10;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    );

    game.events.on(
      "fireSound",
      function () {
        if (!muted) {
          fireSound.play();
        }
      },
      this
    );

    game.events.on(
      "damageSound",
      function () {
        if (!muted) {
          damageSound.play();
        }
      },
      this
    );

    game.events.on(
      "bombSound",
      function () {
        if (!muted) {
          bombSound.play();
        }
      },
      this
    );

    game.events.on(
      "deathSound",
      function () {
        if (!muted) {
          deathSound.play();
        }
      },
      this
    );

    game.events.on(
      "newLevelSound",
      function () {
        if (!muted) {
          newLevelSound.play();
        }
      },
      this
    );

    game.events.on(
      "rockSound",
      function () {
        if (!muted) {
          rockSound.play();
        }
      },
      this
    );

    game.events.on(
      "speedSound",
      function () {
        if (!muted) {
          speedSound.play();
        }
      },
      this
    );

    game.events.on(
      "healthSound",
      function () {
        if (!muted) {
          healthSound.play();
        }
      },
      this
    );

    game.events.on(
      "portSound",
      function () {
        if (!muted) {
          portSound.play();
        }
      },
      this
    );

    shop.events.on(
      "goldByShield",
      function () {
        this.gold -= 200;
        this.maxHealth += 10
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    );

    shop.events.on(
      "goldBySpeed",
      function () {
        this.gold -= 100;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    );

    shop.events.on(
      "goldByDmg",
      function() {
        this.gold -= dmgPrice;
        dmgPrice *= 3;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    );

    shop.events.on(
      "goldByPot",
      function() {
        this.gold -= potPrice;
        potPrice += 50;
        this.hp = this.maxHealth;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    );

    sound.on(
      "pointerup",
      function () {
        if (sound.text == 'Unmute') {
          sound.setText('Mute');
          muted = true;
        } else {
          sound.setText('Unmute');
          muted = false;
        }
      }
    )
  }
}