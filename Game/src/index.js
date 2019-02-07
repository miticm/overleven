import 'phaser';
import MenuScene from "./MenuScene";
import PlayScene from "./PlayScene";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        MenuScene, PlayScene
    },
    physics: {
        default: 'arcade'
    }
};
let menuScene = new MenuScene();

let game = new Phaser.Game(config);
game.scene.add("MenuScene", menuScene);
game.scene.start("MenuScene");