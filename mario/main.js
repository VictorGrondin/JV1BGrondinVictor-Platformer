var config = {
    type: Phaser.AUTO,
    width: 1280, height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            tileBias: 32,
            gravity: { y: 800 },
            debug: true
            
        }
    },
    input: { gamepad: true },
    pixelArt: true,
    scene: [map]

};

new Phaser.Game(config);