// Lose scene
import "phaser";
import { WIDTH, HEIGHT } from "./constants.js";
import { game } from "./game";

export const lose = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function lose() {
    Phaser.Scene.call(this, {
      key: "lose"
    });
  },

  preload: function() {
    this.load.image("menu_button", "assets/menu_button.png");
    this.load.image("retry_button", "assets/retry_button.png");
  },

  create: function() {
    this.add.text(
      WIDTH / 3,
      HEIGHT / 3,
      `You lose...
Enter your name:`,
      {
        fontSize: "32px"
      }
    );

    let textEntry = this.add.text(WIDTH / 3, HEIGHT / 2, "", {
      font: "32px Courier",
      fill: "#ffff00"
    });

    this.input.keyboard.on("keydown", function(event) {
      if (textEntry.text.length > 10) {
        //max length is 10 chars
        return;
      }
      if (event.keyCode === 8 && textEntry.text.length > 0) {
        textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
      } else if (
        event.keyCode === 32 ||
        (event.keyCode >= 48 && event.keyCode < 90)
      ) {
        textEntry.text += event.key;
      }
    });

    let menuButton = this.add
      .sprite(
        this.game.renderer.width - 150,
        this.game.renderer.height - 100,
        "menu_button"
      )
      .setDepth(1);
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

    //******************************** */
    menuButton.on("pointerup", () => {
      this.scene.start("menu");
    });
    //******************************** */

    let retryButton = this.add
      .sprite(
        this.game.renderer.width - 725,
        this.game.renderer.height - 100,
        "retry_button"
      )
      .setDepth(1);
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

    //******************************** */
    retryButton.on(
      "pointerup",
      function() {
        this.scene.start("game");
      },
      this
    );
    //******************************** */
  }
});
