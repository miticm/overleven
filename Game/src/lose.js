// Lose scene
import 'phaser';
import {
  WIDTH,
  HEIGHT
} from './constants.js';

export const lose = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function lose() {
    Phaser.Scene.call(this, {
      key: "lose"
    });
  },

  preload: function () {
    this.load.image("menu_button", "assets/menu_button.png");
    this.load.image("retry_button", "assets/retry_button.png");
  },

  create: function () {
    const text = this.add.text(WIDTH / 2, HEIGHT / 2, "You lose...", {
      fontSize: "32px"
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

    menuButton.on("pointerup", () => {
      this.scene.start("menu");
      this.scene.stop('game');
      this.scene.remove('info');
      //go to next scene
    });
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

    retryButton.on(
      "pointerup",
      function (event) {
        this.scene.start("game");
        enemies = [];
        terrainMatrix = undefined;
      },
      this
    );
  }
});