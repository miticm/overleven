// shop scene
import 'phaser';
import {
  WIDTH,
  HEIGHT
} from './constants.js';

export const char_select = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function shop() {
    Phaser.Scene.call(this, {
      key: "char_select"
    });
  },

  preload: function () {
    this.load.image("wizard", "assets/wizard64.png");
    this.load.image("knight", "assets/knight.png");
  },

  create: function () {

    const text = this.add.text(WIDTH / 2, HEIGHT / 10,
      "Choose your character", {
      fontSize: "32px"
    });

    //shield image
    let wizard = this.add
      .sprite(
        (WIDTH / 3) - 50, HEIGHT / 5,
        "wizard"
      )
      .setDepth(1);
    wizard.setScale(0.15, 0.15);
    wizard.setInteractive();

    wizard.on("pointerover", () => {
      //make play button bloom
      wizard.setScale(0.25, 0.25);
    });
    wizard.on("pointerout", () => {
      //reset button bloom
      wizard.setScale(0.15, 0.15);
    });

    wizard.on(
        "pointerup",
        function (event) {
            characterChoice = "player";
            this.scene.resume("game");
            this.scene.stop();
        },
        this
    );

  } // create end
});
