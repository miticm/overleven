// shop scene
import 'phaser';
import {
  WIDTH,
  HEIGHT
} from './constants.js';

export let characterSelected = "knight";

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

    const text = this.add.text(this.game.renderer.width / 2, HEIGHT / 10,
      "Choose your character", {
      fontSize: "32px"
    });

    // Add Wizrd (player) character 'button'
    let wizard = this.add
      .sprite(
        (WIDTH / 3), HEIGHT / 5,
        "player"
      )
      .setDepth(1);
    wizard.setScale(0.95, 0.95);
    wizard.setInteractive();

    this.anims.create({
      key: "idleWizard",
      frames: [{
        key: "player",
        frame: 0
      }],
      frameRate: 0
    });

    this.anims.create({
      key: "downWizard",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2
      }),
      frameRate: 4,
      repeat: -1
    });

    wizard.on("pointerover", () => {
      //make play button bloom
      wizard.setScale(1, 1);
      wizard.anims.play("downWizard", true);
    });
    wizard.on("pointerout", () => {
      //reset button bloom
      wizard.setScale(0.95, 0.95);
      wizard.anims.play("idleWizard", true);
    });

    // Add Knight (playerKnight) character 'button'
    let knight = this.add
      .sprite(
        (WIDTH*2 / 3), HEIGHT / 5,
        "playerKnight"
      )
      .setDepth(1);
    knight.setScale(0.95, 0.95);
    knight.setInteractive();

    this.anims.create({
      key: "idleKnight",
      frames: [{
        key: "playerKnight",
        frame: 0
      }],
      frameRate: 0
    });

    this.anims.create({
      key: "downKnight",
      frames: this.anims.generateFrameNumbers("playerKnight", {
        start: 1,
        end: 2
      }),
      frameRate: 4,
      repeat: -1
    });

    knight.on("pointerover", () => {
      //make play button bloom
      knight.setScale(1, 1);
      knight.anims.play("downKnight", true);
    });
    knight.on("pointerout", () => {
      //reset button bloom
      knight.setScale(0.95, 0.95);
      knight.anims.play("idleKnight", true);
    });

    // Character select

    wizard.on(
        "pointerup",
        function (event) {
          characterSelected = "player";
          this.scene.start("game");
          this.scene.stop();
        },
        this
    );

    knight.on(
        "pointerup",
        function (event) {
          characterSelected = "playerKnight";
          this.scene.start("game");
          this.scene.stop();
        },
        this
    );

  } // create end
});
