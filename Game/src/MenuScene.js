import PlayScene from "./PlayScene";

var MenuScene = new Phaser.Class({
    
    Extends: Phaser.Scene,

    initialize:
    
    function MenuScene(){
        Phaser.Scene.call(this, { key: 'MenuScene' });
        window.GAME = this;
        this.player;
        this.controls;
        this.cooldown = 0;
    },
    
    preload: function(){
        this.load.image("menu_background", "assets/background.jpg");
        this.load.image("play_button", "assets/play_button.png");
        this.load.image("leaderboard_button", "assets/leaderboard_button.png");


    },

    create: function(){
        let playScene = new PlayScene();

        let background = this.add.sprite(0,0,"menu_background");
        background.setOrigin(0,0);
        

        let playButton = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height / 2 + 50, "play_button").setDepth(1);
        playButton.setInteractive();

        playButton.on("pointerover", () => {
            //make play button bloom
            playButton.setScale(1.5, 1.5);
        })
        playButton.on("pointerout", () => {
            //reset button bloom
            playButton.setScale(1, 1);
        })

        playButton.on("pointerup", () => {
            this.scene.add("PlayScene", playScene);
            this.scene.start("PlayScene");;
            //go to next scene
            console.log("pressed");
        })

        let leaderboardButton = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height / 2 + 130, "leaderboard_button").setDepth(1);
        leaderboardButton.setInteractive();

        leaderboardButton.on("pointerover", () => {
            //make button bloom
            leaderboardButton.setScale(1.5, 1.5);
        })

        leaderboardButton.on("pointerout", () => {
            //reset button bloom
            leaderboardButton.setScale(1, 1);
        })

        leaderboardButton.on("pointerup", () => {
            //this.scene.start(LeaderboardScene);
            //go to leaderboard page
            console.log("pressed");
        })
    }
});

export default MenuScene;