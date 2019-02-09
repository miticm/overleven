// Win scene
import 'phaser';
import { WIDTH, HEIGHT } from './constants.js';
import { game } from './game.js';

export const win = new Phaser.Class({
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