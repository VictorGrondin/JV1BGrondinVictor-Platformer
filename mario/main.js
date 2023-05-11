var config = {
    type: Phaser.AUTO,
    width: 1280, height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false,
            
        }
    },
    input: { gamepad: true },
    pixelArt: true,
    scene: [map]

};

new Phaser.Game(config);