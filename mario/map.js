var nombrefireball = 0;
var canshoot = true;
var toucheE;
var toucheF;
invincible = false;
var player_health = 30;
var fireballgroup;
var cursors;
var player;
var heroY = 33 * 32
var heroX = 7 * 32
var monstreSpeed = 200; // Vitesse de l'ennemi en pixels par seconde
var stopTime = 3000; // Temps d'arrêt en millisecondes
var gameOver;
var checkpoint;
var checkpointEtat = {
    inactive: 0,
    active: 1
};
var currentCheckpointEtat = checkpointEtat.inactive;
var inversGravity;
var gravityDown = true;
gameOver = false;
sens = 1;

class map extends Phaser.Scene {

    constructor() {
        super({ key: 'map' });
        this.seconde = 0
        this.minutes = 0
        this.mort = 0
    }

    preload() {
        this.load.spritesheet('jump', 'assets/jump_ninja.png',
            { frameWidth: 64, frameHeight: 80 });
        this.load.spritesheet('perso', 'assets/personinja.png',
            { frameWidth: 64, frameHeight: 80 });
        this.load.spritesheet('transition', 'assets/transition.png',
            { frameWidth: 48, frameHeight: 80 });
        this.load.spritesheet('fireball', 'assets/fireball.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('barre_de_vie', 'assets/barre_de_vie.png',
            { frameWidth: 144, frameHeight: 168 });
        this.load.spritesheet('checkpoint', 'assets/checkpoint.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('monstre', 'assets/ennemy.png',
            { frameWidth: 64, frameHeight: 64 });
        this.load.image('kitsoin', 'assets/kitsoin.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.image('tilesetPlatformer', 'assets/tilesetPlatformer.png');
        this.load.tilemapTiledJSON("carte", "assets/marioplat.json");

    }
    create() {

        const carteDuNiveau = this.add.tilemap("carte");

        const tileset = carteDuNiveau.addTilesetImage(
            "tilesetPlatformer",
            "tilesetPlatformer"
        );

        const tileset2 = carteDuNiveau.addTilesetImage(
            "ennemy",
            "ennemy"
        );

        const fond = carteDuNiveau.createLayer(
            "fond",
            tileset
        );

        const murs_niveau = carteDuNiveau.createLayer(
            "murs_niveau",
            tileset
        );

        const monstre = carteDuNiveau.createLayer(
            "monstre",
            tileset2
        );


        const spike = carteDuNiveau.createLayer(
            "spike",
            tileset
        );


        //-------------------------------------------------------------------------------------
        murs_niveau.setCollisionByProperty({ solide: true });
        spike.setCollisionByProperty({ solide: true });
        spike.setCollisionByProperty({ degat: true });


        if (heroX && heroY) { player = this.physics.add.sprite(heroX, heroY, 'perso'); }
        player.setAccelerationY(0);
        player.setAccelerationX(0);
        player.setCollideWorldBounds(false);

        this.physics.add.collider(player, murs_niveau);
        this.cameras.main.startFollow(player);
        //------------------------------------------------------------------------------------------------------------------

        this.fireballgroup = this.physics.add.group()

        toucheF = this.input.keyboard.addKey("F");

        //la vie du perso qui s'affiche
        this.vie = this.physics.add.sprite(100, 100, 'barre_de_vie').setScrollFactor(0);
        this.vie.body.setAllowGravity(false);

        //------------------------------------------------------------------------------------------------------------------
        //création ennemi : Monstre 
        //------------------------------------------------------------------------------------------------------------------
        this.monstre = this.physics.add.group({ immovable: true, allowGravity: false });
        this.calque_monstre = carteDuNiveau.getObjectLayer("monstre");
        this.calque_monstre.objects.forEach(calque_monstre => {
            this.evil = this.monstre.create(calque_monstre.x, calque_monstre.y - 16, "monstre");
        });
        this.monstre.setVelocityY(100);

        // lorsque l'ennemi est tué, il laisse tomber un objet
        this.physics.add.overlap(this.fireballgroup, this.monstre, killchampi, null, this);
        function killchampi(player, monstre) {

            monstre.disableBody(true, true);

            this.fireballgroup.getChildren()[nombrefireball - 1].destroy()
            nombrefireball -= 1

        }

        this.physics.add.collider(this.fireballgroup, murs_niveau, function (bdf, mur) {

            bdf.destroy()
            nombrefireball -= 1
        }, null, this);



        this.checkpoint = this.physics.add.group({ immovable: true, allowGravity: false });
        this.calque_checkpoint = carteDuNiveau.getObjectLayer("checkpoint");
        this.checkpoint_list = []
        this.calque_checkpoint.objects.forEach((calque_checkpoint, i) => {
            this.checkpoint_list[i] = this.checkpoint.create(calque_checkpoint.x, calque_checkpoint.y - 16, "checkpoint");
            this.checkpoint_list[i].status = false
        }, null, this);

        checkpoint_ref = this.checkpoint_list


        this.kitsoin = this.physics.add.group({ immovable: true, allowGravity: false });
        this.calque_kitsoin = carteDuNiveau.getObjectLayer("kitsoin");
        this.calque_kitsoin.objects.forEach(calque_kitsoin => {
            this.save = this.kitsoin.create(calque_kitsoin.x, calque_kitsoin.y - 16, "kitsoin");

        }, null, this);


        //------------------------------------------------------------------------------------------------------------------
        //Animation personnage 
        //------------------------------------------------------------------------------------------------------------------
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'perso', frame: 6 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('perso', { start: 7, end: 12 }),
            frameRate: 10,
            repeat: -1

        });

        this.anims.create({
            key: 'fireball',
            frames: this.anims.generateFrameNumbers('fireball', { start: 0, end: 3 }),
            frameRate: 7,
            repeat: -1

        });

        this.anims.create({
            key: 'jump_ninja_left',
            frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 3 }),
            frameRate: 7,
            repeat: 0

        });
        this.anims.create({
            key: 'jump_ninja_right',
            frames: this.anims.generateFrameNumbers('jump', { start: 4, end: 7 }),
            frameRate: 7,
            repeat: 0

        });

        this.anims.create({
            key: 'transition_left',
            frames: this.anims.generateFrameNumbers('transition', { start: 0, end: 0 }),
            frameRate: 7,
            repeat: 0

        });

        this.anims.create({
            key: 'transition_right',
            frames: this.anims.generateFrameNumbers('transition', { start: 1, end: 1 }),
            frameRate: 7,
            repeat: 0

        });
        //------------------------------------------------------------------------------------------------------------------
        //Animation barre de vie 
        //------------------------------------------------------------------------------------------------------------------




        this.anims.create({
            key: 'vie_3',
            frames: this.anims.generateFrameNumbers('barre_de_vie', { start: 3, end: 3 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'vie_2',
            frames: this.anims.generateFrameNumbers('barre_de_vie', { start: 2, end: 2 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'vie_1',
            frames: this.anims.generateFrameNumbers('barre_de_vie', { start: 1, end: 1 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'vie_0',
            frames: this.anims.generateFrameNumbers('barre_de_vie', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });

        //------------------------------------------------------------------------------------------------------------------
        //Animation checkpoint
        //------------------------------------------------------------------------------------------------------------------

        // Créer l'animation du checkpoint inactif
        this.anims.create({
            key: 'checkpointInactive',
            frames: this.anims.generateFrameNumbers('checkpoint', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });

        // Créer l'animation du checkpoint actif
        this.anims.create({
            key: 'checkpointActive',
            frames: this.anims.generateFrameNumbers('checkpoint', { start: 1, end: 1 }),
            frameRate: 1,
            repeat: -1
        });

        //------------------------------------------------------------------------------------------------------------------

        this.anims.create({
            key: 'monstreAnimation',
            frames: this.anims.generateFrameNumbers('monstre', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1
        });

        //------------------------------------------------------------------------------------------------------------------
        //configuration des touche G et F pour inverser la gravité et tirer des boules de feu 
        //------------------------------------------------------------------------------------------------------------------
        cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-G', function (event) {
            if (gravityDown) {
                gravityDown = false;
                player.setFlipX(true);
                player.setAngle(180);
                this.physics.world.gravity.y = -1500;

            } else {
                gravityDown = true;
                player.setFlipX(false);
                player.setAngle(0);
                this.physics.world.gravity.y = 1500;

            }

        }, this);

        this.input.keyboard.on('keydown-F', function (event) {


            if (cursors.right.isDown) {
                player.anims.play("jump_ninja_right")
                setTimeout(() => {
                    player.anims.play('right', true); //et animation => gauche
                }, 500);
            }
            else if (cursors.left.isDown) {
                player.anims.play("jump_ninja_left")
                setTimeout(() => {
                    player.anims.play('left', true); //et animation => gauche
                }, 500);
            }
            else {
                player.anims.play("jump_ninja_right")
                setTimeout(() => {
                    player.anims.play('turn', true); //et animation => gauche
                }, 500);
            }

        }, this); player.anims.play('turn')


        //------------------------------------------------------------------------------------------------------------------

        //------------------------------------------------------------------------------------------------------------------

        this.physics.add.collider(player, spike, function () {
            if (invincible == false) {
                player.setTint("#ff0000")
                invincible = true
                player_health -= 10
                setTimeout(() => {
                    player.clearTint()
                    invincible = false
                }, 1000);
            }
        }, null, this);

        this.physics.add.collider(this.monstre, murs_niveau, this.collision, null, this);
        //------------------------------------------------------------------------------------------------------------------
        this.physics.add.collider(player, this.monstre, function () {
            if (invincible == false) {
                player.setTint("#ff0000")
                invincible = true
                player_health -= 10
                setTimeout(() => {
                    player.clearTint()
                    invincible = false
                }, 1000);
            }
        }, null, this);
        this.timerText = this.add.text(0, 224, 'Temps écoulé : 0', {
            font: '24px Arial',
            fill: '#ffffff'
        });
        this.timerText.setScrollFactor(0)

        this.mortText = this.add.text(0, 280, 'Nombre de mort : 0', {
            font: '24px Arial',
            fill: '#ffffff'
        });
        this.mortText.setScrollFactor(0)

        // Initialiser le minuteur
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }
    //------------------------------------------------------------------------------------------------------------------

    update() {
        if (gameOver) { return; }
        if (player.body.blocked.down || player.body.blocked.up) {

            if (cursors.left.isDown) { //si la touche gauche est appuyée
                player.setVelocityX(-800); //alors vitesse négative en X 
                if (player.anims.currentAnim.key != 'jump_ninja_left') {
                    player.anims.play('left', true); //et animation => gauche

                }
            }
            else if (cursors.right.isDown) { //sinon si la touche droite est appuyée
                player.setVelocityX(800); //alors vitesse positive en X
                if (player.anims.currentAnim.key != 'jump_ninja_right') {
                    player.anims.play('right', true); //et animation => droite


                }
            }

            else { // sinon
                player.setVelocityX(0); //vitesse nulle
                if (player.anims.currentAnim.key != 'jump_ninja_left' && player.anims.currentAnim.key != 'jump_ninja_right') {
                    player.anims.play('turn');
                } //animation fait face caméra


            };
        }
        else {
            if (cursors.left.isDown) { //si la touche gauche est appuyée
                player.setVelocityX(-800);
                player.anims.play('transition_left')

            }
            else if (cursors.right.isDown) { //sinon si la touche droite est appuyée
                player.setVelocityX(800);
                player.anims.play('transition_right')
            };

            //le joueur tire des boules de feu dans toutes les directions 
            var time = this.time.now;


            //------------------------------------------------------------------------------------------------------------------
        }



        if (player_health == 30) {
            this.vie.anims.play("vie_3", true);
        }
        if (player_health == 20) {
            this.vie.anims.play("vie_2", true);
        }
        if (player_health == 10) {
            this.vie.anims.play("vie_1", true);
        }
        if (player_health == 0) {
            this.vie.anims.play("vie_0", true);
        }
        if (gameOver) { return; }


        //------------------------------------------------------------------------------------------------------------------
        if (toucheF.isDown && canshoot == true) {


            if (cursors.left.isDown) {
                this.fireballgroup.create(player.x - 10, player.y, "fireball").body.velocity.x = -1000;



            } else if (cursors.right.isDown) {
                this.fireballgroup.create(player.x + 10, player.y, "fireball").body.velocity.x = 1000;



            } else {
                this.fireballgroup.create(player.x + 10, player.y, "fireball").body.velocity.x = 1000;


            }
            this.fireballgroup.getChildren()[nombrefireball].body.allowGravity = false
            this.fireballgroup.getChildren()[nombrefireball].anims.play('fireball')
            nombrefireball += 1
            canshoot = false
            this.time.addEvent({
                delay: 700, callback: () => {
                    canshoot = true

                },
            })
            //--------------------------------------------------------------------------------------------------------------
            //si le joueur arrive a 0 coeur le jeu gameover
        }
        if (player_health == 0 || player_health <= 0) {
            player.x = heroX
            player.y = heroY

            player_health = 30
            this.mort+=1
        }

        this.mortText.setText("Nombre de morts : "+this.mort)
        
        //----------------------------------------------------------------------------------------------------------------------
        // Gérer les collisions entre le joueur et le checkpoint
        this.physics.add.overlap(player, this.checkpoint, this.CheckpointCollision, null, this);

        // Gérer les collisions entre le joueur et le kit de soin
        this.physics.world.overlap(player, this.kitsoin, this.collectKit, null, this);

        //------------------------------------------------------------------------------------------------------------------
        //configuration mouvement des ennemis 
        //------------------------------------------------------------------------------------------------------------------
    }

    CheckpointCollision(player, checkpoint) {
        // Lorsque le joueur entre en collision avec le checkpoint
        //console.log("Checkpoint atteint !");

        // Changer l'état du checkpoint
        if (checkpoint.status == false) {
            checkpoint.anims.play('checkpointActive');
            checkpoint.status = true
        }
        currentCheckpointEtat = checkpointEtat.active;
        heroX = checkpoint.x
        heroY = checkpoint.y
        // Mettre à jour l'animation du checkpoint

    }


    collision(monstre, mur) {
        console.log("ca touche", monstre.body.velocity.y)
        // Inverser la vélocité du monstre
        if (monstre.body.blocked.down) {

            monstre.setVelocityY(-100);
            monstre.anims.play('monstreAnimation')
        }
        else {

            monstre.setVelocityY(100);
            monstre.anims.play('monstreAnimation')
        }
    }
    //régénération de 2 coeurs si le joueurs prend des degats

    collectKit(player, kitsoin) {
        console.log("delete")
        if (player_health < 30) {
            // Augmentation des points de vie
            player_health += 10;
            kitsoin.destroy();
            if (player_health > 30) {
                player_health = 30;


                // Suppression du kit de soin



            }
        }
    }
    updateTimer() {
        this.seconde += 1
        if (this.seconde == 60) {
            this.seconde = 0
            this.minutes += 1
        }
        if (this.minutes) {
            this.timerText.setText('Temps écoulé : ' + this.minutes + ":" + this.seconde    )
        }
        else { this.timerText.setText('Temps écoulé : ' + this.seconde) }

    }

}

var checkpoint_ref
