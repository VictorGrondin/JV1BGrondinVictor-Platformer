var config = {
    type: Phaser.AUTO,
    width:  896, height: 448,
    physics: {
        default: 'arcade',
        arcade: {
            tileBias: 32,
            gravity: { y: 800 },
            debug: false
            
        }
    },
    input: { gamepad: true },
    pixelArt: true,
    scene: [Menuaccueil,map],

};

new Phaser.Game(config);