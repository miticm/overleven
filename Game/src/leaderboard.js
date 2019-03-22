import "phaser";

import { HEIGHT, WIDTH, LEADERBOARD_NUM } from "./constants.js";

let names = {};
let texts = [];

export const leaderboard = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function menu() {
    Phaser.Scene.call(this, {
      key: "leaderboard"
    });
    window.GAME = this;
  },

  preload: function() {
    this.load.image("menu_background", "assets/background.jpg");
    this.load.image("play_button", "assets/start.png");
    this.load.image("leaderboard_button", "assets/leaderboard.png");
    this.load.image("game_title", "assets/overleven.png");
    this.load.image("retry_button", "assets/retry_button.png");
  },

  create: function() {
    let background = this.add.sprite(0, 0, "menu_background");
    background.setScale(1.7, 1.7);
    background.setOrigin(0, 0);

    let playButton = this.add
      .sprite(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 + 250,
        "retry_button"
      )
      .setDepth(1);
    playButton.setInteractive();
    playButton.setScale(0.2, 0.2);

    playButton.on("pointerover", () => {
      //make play button bloom
      playButton.setScale(0.3, 0.3);
    });

    playButton.on("pointerout", () => {
      //reset button bloom
      playButton.setScale(0.2, 0.2);
    });

    playButton.on("pointerup", () => {
    });

    fetchLeaderboard.call(this);

    for (let i = 0; i < LEADERBOARD_NUM; i++) {
      texts[i] = this.add.text(WIDTH / 2 - 50, HEIGHT / 2 - 200 + i * 30, ``, {
        font: "20px Arial",
        fill: "#ffffff"
      });
    }
  }
});

function fetchLeaderboard() {
  const database = firebase.database();

  const thing = firebase
    .database()
    .ref("/leaderboard")
    .once("value")
    .then(function(snapshot) {
      names = snapshot.val();

      // Sort the names by score
      const keys = Object.keys(names);

      keys.sort(compareScores);

      for (let i = 0; i < keys.length; i++) {
        if (i >= LEADERBOARD_NUM) {
          break;
        }
        texts[i].setText(`${keys[i]}: ${names[keys[i]]}`);
      }
    });
}

function compareScores(a, b) {
  if (names[a] < names[b]) return 1;
  if (names[a] > names[b]) return -1;
  return 0;
}
