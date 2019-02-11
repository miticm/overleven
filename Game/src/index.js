import "phaser";
import {
  HEIGHT,
  WIDTH
} from "./constants.js";

// Scenes
import {
  menu
} from './menu.js';
import {
  win
} from './win.js';
import {
  preloader
} from './preloader.js';
import {
  lose
} from './lose.js';
import {
  game
} from './game.js';

// Config and set up the game, in general don't mess with
var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: WIDTH,
  height: HEIGHT,
  scene: [preloader, menu, game, win, lose],
  physics: {
    default: "arcade"
  }
};

// game variables
let start = new Phaser.Game(config);