import 'phaser';

export const menu = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function menu() {
    Phaser.Scene.call(this, {
      key: "menu"
    });
    window.GAME = this;
  },

  preload: function () {
    this.load.image("menu_background", "assets/background.jpg");
    this.load.image("play_button", "assets/play_button.png");
    this.load.image("leaderboard_button", "assets/leaderboard_button.png");
    this.load.image("game_title", "assets/game_title.png");
  },

  create: function () {
    let background = this.add.sprite(0, 0, "menu_background");
    background.setScale(1.7, 1.7);
    background.setOrigin(0, 0);

    this.add
      .sprite(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 100,
        "game_title"
      )
      .setDepth(1);

    let playButton = this.add
      .sprite(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 + 50,
        "play_button"
      )
      .setDepth(1);
    playButton.setInteractive();

    playButton.on("pointerover", () => {
      //make play button bloom
      playButton.setScale(1.5, 1.5);
    });

    playButton.on("pointerout", () => {
      //reset button bloom
      playButton.setScale(1, 1);
    });

    playButton.on("pointerup", () => {
      this.scene.start("game");
      //go to next scene
    });

    let leaderboardButton = this.add
      .sprite(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 + 130,
        "leaderboard_button"
      )
      .setDepth(1);
    leaderboardButton.setInteractive();

    leaderboardButton.on("pointerover", () => {
      //make button bloom
      leaderboardButton.setScale(1.5, 1.5);
    });

    leaderboardButton.on("pointerout", () => {
      //reset button bloom
      leaderboardButton.setScale(1, 1);
    });

    leaderboardButton.on("pointerup", () => {
      //go to leaderboard page
    });
  }
});