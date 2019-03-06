import { hp, gold, maxHealth, enemyCount, fireSound} from "./game";
export class InfoScene extends Phaser.Scene {
  constructor() {
    super({ key: "info", active: false });
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

    // //  Listen for events from it
    game.events.on(
      "reduceHP",
      function() {
        this.hp -= 1;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    );

    game.events.on(
      "increaseHP",
      function() {
        this.hp += 5;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    );

    game.events.on(
      "checkEnemiesDeath",
      function() {
        this.enemiesRemaining = enemyCount;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    )

    game.events.on(
      "increaseGold",
      function() {
        this.gold += 200;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    );

    game.events.on(
      "fireSound",
      function() {
        console.log(this.muted);
        if (!this.muted) {
          fireSound.play();
        }
      },
      this
    );

    shop.events.on(
      "goldByShield",
      function() {
        this.gold -= 200;
        this.maxHealth += 10
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    );

    shop.events.on(
      "goldBySpeed",
      function() {
        this.gold -= 100;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}\nEnemies remaining: ${this.enemiesRemaining}`);
      },
      this
    );

    sound.on(
      "pointerup",
      function() {
        if (sound.text == 'Mute') {
          sound.setText('Unmute');
          this.muted = true;
        }
        else {
          sound.setText('Mute');
          this.muted = false;
        }
      }
    )
  }
}
