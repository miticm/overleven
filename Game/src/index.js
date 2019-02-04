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

let cooldown = 0;

function preload ()
{
    this.load.image('grass', 'assets/grass.png')
    this.load.spritesheet('player', 'assets/player_sheet.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.image('bullet', 'assets/bullet.png');
}

function create ()
{
    const BetweenPoints = Phaser.Math.Angle.BetweenPoints;
    const SetToAngle = Phaser.Geom.Line.SetToAngle;
    const velocityFromRotation = this.physics.velocityFromRotation;
    const velocity = new Phaser.Math.Vector2();
    const line = new Phaser.Geom.Line();

    const grass = this.add.image(400, 300, 'grass');
    player = this.physics.add.sprite(20, 20, 'player');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    controls = this.input.keyboard.createCursorKeys();

    this.input.on('pointermove', function (pointer) {
        const angle = BetweenPoints(player, pointer);
        SetToAngle(line, player.x, player.y, angle, 128);
        velocityFromRotation(angle, 600, velocity);
    }, this);

    this.input.on('pointerup', function () {
        if (cooldown <= 0) {
            const bullet = this.physics.add.sprite(player.x, player.y, 'bullet');
            bullet.enableBody(true, player.x, player.y, true, true).setVelocity(velocity.x, velocity.y);
            cooldown = 20;
        }
    }, this);
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

    cooldown -= 1;
}