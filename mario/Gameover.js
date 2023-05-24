gameOver = false;
sens = 1;






class Gameover extends Phaser.Scene {

  constructor() {
    super({ key: 'Gameover' });
  }


  preload() {
    this.load.image('go', 'assets/gameover.png');
    this.load.image('restart', 'assets/restart.png');
    
  }

  create() {
    const go = this.add.image(640, 360, "go");// Ajouter l'image de l'écran de fin 
    const restart_bt = this.add.image(640, 400, "restart").setInteractive();// Ajoute le bouton restart
    

     //Ajoute  événements pour le boutone
    restart_bt.on('pointerdown', () => {
      this.scene.start('Menuaccueil');
    });

  }
  update() { }

}