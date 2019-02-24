import { hp } from "./game";
export class InfoScene extends Phaser.Scene {
  constructor() {
    super({ key: "info", active: false });
    this.hp = hp;
  }

  create() {
    let info = this.add.text(10, 10, `HP: ${this.hp}`, {
      font: "22px Arial",
      fill: "#fff000"
    });

    //  Grab a reference to the Game Scene
    let game = this.scene.get("game");

    // //  Listen for events from it
    game.events.on(
      "reduceHP",
      function() {
        this.hp -= 1;
        info.setText("HP: " + this.hp);
      },
      this
    );
  }
}
