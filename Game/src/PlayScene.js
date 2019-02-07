var PlayScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function PlayScene(){
        Phaser.Scene.call(this, { key: 'PlayScene' });
        window.GAME = this;
        this.player;
        this.controls;
        this.cooldown = 0;
    },

    /*preload(){
        this.load.image("grass", "assets/grass.png");
    }

    create(){
        let background = this.add.sprite(0,0,"grass");
        background.setOrigin(0,0);        
    }*/

    preload: function ()
    {
        this.load.image('grass', 'assets/grass.png');
        this.load.image('stone', 'assets/stone.jpeg');
        this.load.spritesheet('player', 'assets/player_sheet.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image('bullet', 'assets/bullet.png');
    },

    create: function ()
    {
        const BetweenPoints = Phaser.Math.Angle.BetweenPoints;
        const SetToAngle = Phaser.Geom.Line.SetToAngle;
        const velocityFromRotation = this.physics.velocityFromRotation;
        const velocity = new Phaser.Math.Vector2();
        const line = new Phaser.Geom.Line();

        const grass = this.add.image(400, 300, 'grass');
        this.player = this.physics.add.sprite(20, 20, 'player');

        const stones = this.physics.add.staticGroup();
        stones.create(200, 200, 'stone').setScale(1);

        this.physics.add.collider(this.player, stones);

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.controls = this.input.keyboard.createCursorKeys();

        this.input.on('pointermove', function (pointer) {
            const angle = BetweenPoints(this.player, pointer);
            SetToAngle(line, this.player.x, this.player.y, angle, 128);
            velocityFromRotation(angle, 600, velocity);
        }, this);

        this.input.on('pointerup', function () {
            if (this.cooldown <= 0) {
                const bullet = this.physics.add.sprite(this.player.x, this.player.y, 'bullet');
                bullet.enableBody(true, this.player.x, this.player.y, true, true).setVelocity(velocity.x, velocity.y);
                this.cooldown = 20;
                this.physics.add.overlap(bullet, stones, this.breakGround, null, this);
            }
        }, this);
    },

    update: function() {
        if (this.controls.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.controls.right.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.controls.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.controls.down.isDown) {
            this.player.setVelocityY(160);
        } else {
            this.player.setVelocityY(0);
        }

        this.cooldown -= 1;
    },

    breakGround: function (bullet, stone) {
        bullet.disableBody(true, true);
        stone.disableBody(true, true);
    }
  
});

export default PlayScene;