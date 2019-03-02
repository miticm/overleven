// shop scene
import 'phaser';
import {
  WIDTH,
  HEIGHT
} from './constants.js';
import { hp, gold, maxHealth, maxPlayerSpeed} from "./game";
let shieldBought = false;
let speedBought = false;


export const shop = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function shop() {
    Phaser.Scene.call(this, {
      key: "shop"
    });
  },

  preload: function () {
    this.load.image("menu_button", "assets/menu_button.png");
    this.load.image("resume_button", "assets/resume_button.png");
    this.load.image("shield", "assets/shield.png");
    this.load.image("speed", "assets/speed.png");
  },

  create: function () {

    const text = this.add.text(WIDTH / 2, HEIGHT / 10, "Shop", {
      fontSize: "32px"
    });

    const text1 = this.add.text(WIDTH / 3, HEIGHT / 5, "Inc Max Health ($200)", {
        fontSize: "32px"
    });

    //shield image
    let shield = this.add
      .sprite(
        (WIDTH / 3) - 50, HEIGHT / 5,
        "shield"
      )
      .setDepth(1);
    shield.setScale(0.15, 0.15);
    shield.setInteractive();

    shield.on("pointerover", () => {
      //make play button bloom
        shield.setScale(0.25, 0.25);
    });
    shield.on("pointerout", () => {
      //reset button bloom
        shield.setScale(0.15, 0.15);
    });

    shield.on(
        "pointerup",
        function (event) {
            if(gold >= 200){
                if(shieldBought == false){
                    this.events.emit("goldByShield");
                    shieldBought = true;
                }
            }
        },
        this
    );
    //hide shield so it is known it is bought
    if(shieldBought == true){
        shield.visible = false;
    }
    
    const text2 = this.add.text(WIDTH / 3, (HEIGHT / 5) + 50, "Inc Max Speed ($100)", {
    fontSize: "32px"
    });

    //speed image
    let speed = this.add
      .sprite(
        (WIDTH / 3) - 50, (HEIGHT / 5) + 50,
        "speed"
      )
      .setDepth(1);
    speed.setScale(0.15, 0.15);
    speed.setInteractive();

    speed.on("pointerover", () => {
      //make play button bloom
        speed.setScale(0.25, 0.25);
    });
    speed.on("pointerout", () => {
      //reset button bloom
        speed.setScale(0.15, 0.15);
    });

    speed.on(
        "pointerup",
        function (event) {
            if(gold >= 100){
                console.log(gold);
                if(speedBought == false){
                    this.events.emit("goldBySpeed");
                    speedBought = true;
                }
                
            }
        },
        this
    );
    //hide speed so it is known it is bought
    if(speedBought == true){
        speed.visible = false;
    }

    const text3 = this.add.text(WIDTH / 3, (HEIGHT / 5) + 100, "Buy", {
        fontSize: "32px"
    });

    const text4 = this.add.text(WIDTH / 3, (HEIGHT / 5) + 150, "Buy", {
        fontSize: "32px"
      });

    let playButton = this.add
      .sprite(
        this.game.renderer.width - 725,
        this.game.renderer.height - 100,
        "resume_button"
      )
      .setDepth(1);
    playButton.setScale(0.15, 0.15);
    playButton.setInteractive();

    playButton.on("pointerover", () => {
      //make play button bloom
      playButton.setScale(0.25, 0.25);
    });
    playButton.on("pointerout", () => {
      //reset button bloom
      playButton.setScale(0.15, 0.15);
    });

    playButton.on(
      "pointerup",
      function (event) {
        this.scene.resume('game');
        this.scene.stop();
      },
      this
    );
  }
});