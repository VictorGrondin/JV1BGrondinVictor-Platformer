class Menuaccueil extends Phaser.Scene {

    constructor() {
      super({ key: 'Menuaccueil' });
    }
  
  
    preload() {
      this.load.image('background', 'assets/fond_ninjarun.png');
      this.load.image('play', 'assets/play.png');
      this.load.image('option', 'assets/option.png');
    }
  
    create() {
      const bg = this.add.image(640, 360, "background");// Ajouter l'image de l'écran d'accueil
      const play_bt = this.add.image(640, 400, "play").setInteractive();// Ajoute le bouton
      const info_bt = this.add.image(640, 500, "option").setInteractive();// Ajoute le bouton
       bg.setScale()
  
      // Ajouter des événements pour les boutons
      play_bt.on('pointerdown', () => {
        this.scene.start('map');
      });
  
      info_bt.on('pointerdown', () => {
        this.scene.start('info');
      });
    }
}