// Pause scene
import "phaser";
import { WIDTH, HEIGHT } from "./constants.js";

export const pause = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function pause() {
    Phaser.Scene.call(this, {
      key: "pause"
    });
  },

  preload: function() {
    this.load.image("menu_button", "assets/menu_button.png");
    this.load.image("resume_button", "assets/resume_button.png");
    this.load.image("resume", "assets/resume.png");
  },

  create: function() {
    const text = this.add.text(WIDTH / 2, HEIGHT / 2, "PAUSED", {
      fontSize: "32px"
    });
    let menuButton = this.add
      .sprite(
        this.game.renderer.width - 150,
        this.game.renderer.height - 150,
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
      this.scene.stop("game");
      this.scene.remove("info");
      this.scene.stop("pause");
      this.scene.start("menu");
      location.reload();
    });
    let playButton = this.add
      .sprite(
        this.game.renderer.width - 725,
        this.game.renderer.height - 150,
        "resume"
      )
      .setDepth(1);
    playButton.setScale(0.95, 0.95);
    playButton.setInteractive();

    playButton.on("pointerover", () => {
      //make play button bloom
      playButton.setScale(1, 1);
    });
    playButton.on("pointerout", () => {
      //reset button bloom
      playButton.setScale(0.95, 0.95);
    });

    playButton.on(
      "pointerup",
      function(event) {
        this.scene.stop("pause");
        this.scene.resume("game");
      },
      this
    );
  }
});
