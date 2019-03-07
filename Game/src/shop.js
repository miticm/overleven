// shop scene
import 'phaser';
import {
  WIDTH,
  HEIGHT
} from './constants.js';
import { hp, gold, maxHealth, maxPlayerSpeed} from "./game";
let shieldBought = false;
let speedBought = false;
let dmgBought = 0;
let goldForDamage = 50;
let goldForPot = 50;
let potBought = 0;


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
    this.load.image("dmg", "assets/dmg.png");
    this.load.image("aid", "assets/firstaid.png");

  },

  create: function () {

    const text = this.add.text(WIDTH / 2, HEIGHT / 10, "Shop", {
      fontSize: "32px"
    });

    const text1 = this.add.text(WIDTH / 3, HEIGHT / 5, "Inc Max Health ($200)", {
        fontSize: "32px"
    });

    if(shieldBought == true){
        text1.setText("SOLD");
    }

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
        shield.setScale(0.18, 0.18);
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
                    text1.setText("SOLD");
                }
            }
        },
        this
    );
    
    const text2 = this.add.text(WIDTH / 3, (HEIGHT / 5) + 60, "Inc Max Speed ($100)", {
    fontSize: "32px"
    });
    
    if(speedBought == true){
        text2.setText("SOLD");
    }

    //speed image
    let speed = this.add
      .sprite(
        (WIDTH / 3) - 50, (HEIGHT / 5) + 60,
        "speed"
      )
      .setDepth(1);
    speed.setScale(0.15, 0.15);
    speed.setInteractive();

    speed.on("pointerover", () => {
      //make play button bloom
        speed.setScale(0.18, 0.18);
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
                    text2.setText("SOLD");
                }
                
            }
        },
        this
    );

    const text3 = this.add.text(WIDTH / 3, (HEIGHT / 5) + 120, `Inc Q dmg ($${goldForDamage})`, {
        fontSize: "32px"
    });

    if(dmgBought == 3){
        text3.setText("SOLD");
    }

    //speed image
    let dmg = this.add
      .sprite(
        (WIDTH / 3) - 50, (HEIGHT / 5) + 120,
        "dmg"
      )
      .setDepth(1);
    dmg.setScale(0.15, 0.15);
    dmg.setInteractive();

    dmg.on("pointerover", () => {
      //make play button bloom
        dmg.setScale(0.18, 0.18);
    });
    dmg.on("pointerout", () => {
      //reset button bloom
        dmg.setScale(0.15, 0.15);
    });

    dmg.on(
        "pointerup",
        function (event) {
            if(gold >= goldForDamage){
                if(dmgBought != 3){
                    this.events.emit("goldByDmg");
                    dmgBought++;
                    goldForDamage *= 3;
                    if(dmgBought != 3){
                        text3.setText(`Inc Q dmg ($${goldForDamage})`);
                    } else {
                        text3.setText("SOLD");
                    }
                }
                
            }
        },
        this
    );

    const text4 = this.add.text(WIDTH / 3, (HEIGHT / 5) + 180, `Refill Health ($${goldForPot})`, {
        fontSize: "32px"
    });

      if(potBought == 3){
        text4.setText("SOLD");
    }

    //speed image
    let pot = this.add
      .sprite(
        (WIDTH / 3) - 50, (HEIGHT / 5) + 180,
        "aid"
      )
      .setDepth(1);
    pot.setScale(1, 1);
    pot.setInteractive();

    pot.on("pointerover", () => {
      //make play button bloom
        pot.setScale(1.18, 1.18);
    });
    pot.on("pointerout", () => {
      //reset button bloom
        pot.setScale(1, 1);
    });

    pot.on(
        "pointerup",
        function (event) {
            if(gold >= goldForPot){
                if(potBought != 3){
                  if(hp != maxHealth){
                    this.events.emit("goldByPot");
                    potBought++;
                    goldForPot += 50;
                    if(potBought != 3){
                        text4.setText(`Refill Health ($${goldForPot})`);
                    } else {
                        text4.setText("SOLD");
                    }
                  }
                }
                
            }
        },
        this
    );

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