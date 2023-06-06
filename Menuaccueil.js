class Menuaccueil extends Phaser.Scene {

    constructor() {
        super({ key: 'Menuaccueil' });
    }


    preload() {
        this.load.image('background', 'assets/fond_ninjarun.png');
        this.load.image('play', 'assets/play.png');
        this.load.image('option', 'assets/option.png');
        this.load.image('logo', 'assets/logo.png');
    }

    create() {
        const bg = this.add.image(450, 225, "background");// Ajoute l'image de l'écran d'accueil
        this.add.image(450, 70, "logo");// Ajoute le logo
        const play_bt = this.add.image(200, 230, "play").setInteractive();// Ajoute le bouton
        const option_bt = this.add.image(200, 320, "option").setInteractive();// Ajoute le bouton


        // Ajouter des événements pour les boutons
        play_bt.on('pointerdown', () => {
            this.scene.start('map');
        });

        option_bt.on('pointerdown', () => {
            this.scene.start('option');
        });
    }
}