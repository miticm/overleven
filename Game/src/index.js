import 'phaser';

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    physics: {
        default: 'arcade'
    }
};

let game = new Phaser.Game(config);

let player;
let controls;

function preload ()
{
    this.load.image('logo', 'assets/logo.png');
    this.load.image('grass', 'assets/grass.png')
    this.load.spritesheet('player', 'assets/player_sheet.png', {
        frameWidth: 32,
        frameHeight: 32
    });
}

function create ()
{
    const grass = this.add.image(400, 300, 'grass');
    player = this.physics.add.sprite(20, 20, 'player');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    controls = this.input.keyboard.createCursorKeys();
}

function update() {
    if (controls.left.isDown) {
        player.setVelocityX(-160);
    } else if (controls.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (controls.up.isDown) {
        player.setVelocityY(-160);
    } else if (controls.down.isDown) {
        player.setVelocityY(160);
    } else {
        player.setVelocityY(0);
    }
}