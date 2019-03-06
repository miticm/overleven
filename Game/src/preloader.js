// Preloader scene
import "phaser";

export const preloader = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function Preloader() {
    Phaser.Scene.call(this, {
      key: "preloader"
    });
  },
  preload: preload,

  create: function() {
    this.scene.start("menu");
  }
});

// Function is ran before load, basically loads in all assets
function preload() {
  this.load.image("grass", "assets/grass.png");
  this.load.image("ground", "assets/sml_rock64.png");
  this.load.image("bullet", "assets/bullet.png");
  this.load.spritesheet("ice", "assets/ice.png", {
    frameWidth: 64,
    frameHeight: 64
  })
  this.load.spritesheet("enemy", "assets/slime64.png", {
    frameWidth: 64,
    frameHeight: 64
  });
  this.load.image("boot", "assets/boot.png");
  this.load.image("firstaid", "assets/firstaid.png");
  //this.load.image("Q", "assets/qability.png");
  this.load.image("potion", "assets/potion.png");
  this.load.image("tree", "assets/tree.png");
  this.load.spritesheet("player", "assets/wizard64.png", {
    frameWidth: 64,
    frameHeight: 64
  });
  this.load.spritesheet("fireball", "assets/fireball.png", {
    frameWidth: 64,
    frameHeight: 64
  });
  this.load.spritesheet("mine", "assets/mine.png", {
    frameWidth: 64,
    frameHeight: 64
  });
}
