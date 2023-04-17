



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
        this.load.spritesheet('perso', 'assets/personinja.png',
            { frameWidth: 68, frameHeight: 80 });
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



        

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{key: 'perso', frame : 3}],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('perso', { start: 4, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-G', function (event) {
            if(gravityDown) {
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
        },this);    
    }
        



    update() {
        if (gameOver) { return; }

        if (cursors.left.isDown) { //si la touche gauche est appuyée
            player.setVelocityX(-460); //alors vitesse négative en X 
            player.anims.play('left', true); //et animation => gauche

        }
        else if (cursors.right.isDown) { //sinon si la touche droite est appuyée
            player.setVelocityX(460); //alors vitesse positive en X
            player.anims.play('right', true); //et animation => droite



        }
        
        else { // sinon
            player.setVelocityX(0); //vitesse nulle
            
            player.anims.play('turn'); //animation fait face caméra
        }
        if (cursors.up.isDown){
            player.setVelocityY(-150)
        }
    
        
        }
    }

    