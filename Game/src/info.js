import { hp, gold, maxHealth} from "./game";
export class InfoScene extends Phaser.Scene {
  constructor() {
    super({ key: "info", active: false });
    this.hp = hp;
    this.gold = gold;
    this.maxHealth = maxHealth;
  }

  create() {
    let info = this.add.text(10, 10, `HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}`, {
      font: "22px Arial",
      fill: "#fff000"
    });

    //  Grab a reference to the Game Scene
    let game = this.scene.get("game");
    let shop = this.scene.get("shop");

    // //  Listen for events from it
    game.events.on(
      "reduceHP",
      function() {
        this.hp -= 1;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}`);
      },
      this
    );

    game.events.on(
      "increaseHP",
      function() {
        this.hp += 5;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}`);
      },
      this
    );

    game.events.on(
      "increaseGold",
      function() {
        this.gold += 200;
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}`);
      },
      this
    );

    shop.events.on(
      "goldByShield",
      function() {
        this.gold -= 200;
        this.maxHealth += 10
        info.setText(`HP: ${this.hp}\/${this.maxHealth}\nGold: ${this.gold}`);
      },
      this
    );
  }
}
