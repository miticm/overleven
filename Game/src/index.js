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
    this.load.image('grass', 'assets/grass.png');
    this.load.image('stone', 'assets/sml_rock64.png');
    this.load.spritesheet('player', 'assets/wizard64.png', {
        frameWidth: 64,
        frameHeight: 64
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

    const stones = this.physics.add.staticGroup();
    stones.create(200, 200, 'stone').setScale(1);

    this.physics.add.collider(player, stones);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // player animations
    this.anims.create({
        key: 'idle',
        frames: [ { key: 'dude', frame: 0 } ],
        frameRate: 0
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', { start: 7, end: 8 }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 3, end: 4 }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 6 }),
        frameRate: 5,
        repeat: -1
    });

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
            this.physics.add.overlap(bullet, stones, breakGround, null, this);
        }
    }, this);
}

function update() {
    if (controls.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (controls.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
    }

    if (controls.up.isDown) {
        player.setVelocityY(-160);
        player.anims.play('up', true);
    } else if (controls.down.isDown) {
        player.setVelocityY(160);
        player.anims.play('down', true);
    } else {
        player.setVelocityY(0);
    }

    cooldown -= 1;
}

function breakGround(bullet, stone) {
    bullet.disableBody(true, true);
    stone.disableBody(true, true);
}
