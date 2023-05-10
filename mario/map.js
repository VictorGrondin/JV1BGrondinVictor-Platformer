var nombrefireball=0;
var lastFired = 0;
var toucheE;
var fireballgroup;
var cursors;
var player;
var gameOver;
var inversGravity;
var gravityDown = true;
gameOver = false;
sens = 1;

class map extends Phaser.Scene {

    constructor() {
        super({ key: 'map' });
    }

    preload() {
        this.load.spritesheet('jump', 'assets/jump_ninja.png',
            { frameWidth: 64, frameHeight: 80 });
        this.load.spritesheet('perso', 'assets/personinja.png',
            { frameWidth: 68, frameHeight: 80 });
        this.load.spritesheet('fireball', 'assets/fireball.png',
            { frameWidth: 32, frameHeight: 32});
        this.load.image('tilesetPlatformer', 'assets/tilesetPlatformer.png');
        this.load.tilemapTiledJSON("carte", "assets/marioplat.json");

    }
    create() {

        const carteDuNiveau = this.add.tilemap("carte");

        const tileset = carteDuNiveau.addTilesetImage(
            "tilesetPlatformer",
            "tilesetPlatformer"
        );

        const fond = carteDuNiveau.createLayer(
            "fond",
            tileset
        );
        const murs_niveau = carteDuNiveau.createLayer(
            "murs_niveau",
            tileset
        );



        murs_niveau.setCollisionByProperty({ solide: true });

        player = this.physics.add.sprite(24 * 32, 29 * 32, 'perso');
        player.setCollideWorldBounds(false);
        this.physics.add.collider(player, murs_niveau);

        //inversGravity = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);

        // redimentionnement du monde avec les dimensions calculées via tiled
        // this.physics.world.setBounds(0, 0, 91204, 6000);
        //  ajout du champs de la caméra de taille identique à celle du monde
        // this.cameras.main.setBounds(0, 0, 91204, 91204);
        // ancrage de la caméra sur le joueur
        this.cameras.main.startFollow(player);

        this.fireballgroup = this.physics.add.group()
     
        toucheE = this.input.keyboard.addKey("E");


        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'perso', frame: 3 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('perso', { start: 4, end: 6 }),
            frameRate: 10,
            repeat: -1

        });

        this.anims.create({
            key: 'fireball',
            frames: this.anims.generateFrameNumbers('fireballgroup', { start: 0, end: 3 }),
            frameRate: 7,
            repeat: 0

        });

        this.anims.create({
            key: 'jump_ninja',
            frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 3 }),
            frameRate: 7,
            repeat: 0

        });

        cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-G', function (event) {
            if (gravityDown) {
                gravityDown = false;
                player.setFlipX(true);
                player.setAngle(180);
                this.physics.world.gravity.y = -800;
            } else {
                gravityDown = true;
                player.setFlipX(false);
                player.setAngle(0);
                this.physics.world.gravity.y = 800;
            }



        }, this);

        this.input.keyboard.on('keydown-F', function (event) {

            player.anims.play("jump_ninja")
            if (cursors.right.isDown) {
            setTimeout(() => {
                player.anims.play('right', true); //et animation => gauche
            }, 500);}
            if (cursors.left.isDown) {
                setTimeout(() => {
                    player.anims.play('left', true); //et animation => gauche
                }, 500);}
        }, this); player.anims.play('turn')

    }




    update() {
        if (gameOver) { return; }

        if (cursors.left.isDown) { //si la touche gauche est appuyée
            player.setVelocityX(-600); //alors vitesse négative en X 
            if (player.anims.currentAnim.key != 'jump_ninja') {
                player.anims.play('left', true); //et animation => gauche
                
            }
        }
        else if (cursors.right.isDown) { //sinon si la touche droite est appuyée
            player.setVelocityX(600); //alors vitesse positive en X
            if (player.anims.currentAnim.key != 'jump_ninja') {
                player.anims.play('right', true); //et animation => droite

                
            }


        }

        else { // sinon
            player.setVelocityX(0); //vitesse nulle
            if (player.anims.currentAnim.key != 'jump_ninja') {
                player.anims.play('turn');
            } //animation fait face caméra


        };
        //le joueur tire des boules de feu dans toutes les directions 
        var time = this.time.now;

        if (toucheE.isDown && time > lastFired && (cursors.left.isDown || cursors.right.isDown )) {

            
            if (cursors.left.isDown) {
                this.fireballgroup.create(player.x, player.y, "fireball").body.velocity.x = -500;
                this.fireballgroup.list[nombrefireball].body.allowGravity = false
            nombrefireball+=1
//
            } else if (cursors.right.isDown) {
                this.fireballgroup.create(player.x, player.y, "fireball").body.velocity.x = 500;
                this.fireballgroup.list[nombrefireball].body.allowGravity = false
            nombrefireball+=1
          //

            }
       }
}
}
