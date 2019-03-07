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

  this.load.audio('die', 'assets/sounds/die.wav');
  this.load.audio('bomb', 'assets/sounds/bomb.wav');
  this.load.audio('damage', 'assets/sounds/damage.wav');
  this.load.audio('fire', 'assets/sounds/fire.wav');
  this.load.audio('newLevel', 'assets/sounds/new_level.wav');
  this.load.audio('rock', 'assets/sounds/rock_break.wav');
  this.load.audio('speed', 'assets/sounds/speed.wav');
  this.load.audio('health', 'assets/sounds/health.wav');
  this.load.audio('port', 'assets/sounds/port.wav');
}
