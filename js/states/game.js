var gameState = {

    //chargement des params du niveau
    init : function(){
        //console.log("Game state init");

    },

    preload : function(){
        //console.log("Game state preload");
        this.UP = -1;
        this.DOWN = 1;
        this.LEFT = -1;
        this.RIGHT = 1;
        this.GROUNDLEVEL=360;

        this.MAXHP = 5;

        this.LEVELBOTTOM=game.global.gameHeight;

        this.levelSpeed = 1;
        this.nextProjectileId = 1;
    },

    create : function(){

        game.physics.startSystem(Phaser.Physics.ARCADE);
        //Ajout du background
        game.add.sprite(-20,-20,"background_game");

         //Sons
        this.gameSounds = {};
        this.gameSounds.enemy_destroyed = game.add.audio("enemy_destroyed");
        this.gameSounds.SEI = game.add.audio("SEI");
        this.gameSounds.HOI = game.add.audio("HOI");
        this.gameSounds.perfect = game.add.audio("perfect");
        this.gameSounds.double_ko = game.add.audio("double_ko");
        this.gameSounds.green_wins = game.add.audio("green_wins");
        this.gameSounds.blue_wins = game.add.audio("blue_wins");
        this.gameSounds.three_two_one_fight = game.add.audio("three_two_one_fight");

        this.gameSounds.three_two_one_fight.play();


        this.randomGenerator = new Phaser.RandomDataGenerator(1337);


        //console.log("game state create() finished");


        //Ajout des players
        this.playerA = game.add.sprite(100, this.GROUNDLEVEL, 'player');
        this.playerA.life = this.MAXHP;
        this.playerA.enableBody = true;
        this.playerA.animations.add('idle', [0,1], 3, true);
        this.playerA.animations.play('idle');
        this.playerA.tint="0x009900";
        game.physics.enable(this.playerA, Phaser.Physics.ARCADE);

        this.playerB = game.add.sprite(game.global.gameWidth - 100, this.GROUNDLEVEL, 'player');
        this.playerB.life = this.MAXHP;
        this.playerB.enableBody = true;
        this.playerB.animations.add('idle', [0,1], 3, true);
        this.playerB.animations.play('idle');
        this.playerB.tint="0x000099";
        this.playerB.scale.setTo(-1,1);
        game.physics.enable(this.playerB, Phaser.Physics.ARCADE);


        //dot sur le feu
        this.loopFireDot = game.time.events.loop(1000, this.fireDot, this);

        //Particules explosions
        this.emitterExplosion = game.add.emitter(0, 0 , 180);
        this.emitterExplosion.setXSpeed(-150, 150);
        this.emitterExplosion.setYSpeed(-150, 150);
        this.emitterExplosion.minParticleScale = 0.8;
        this.emitterExplosion.maxParticleScale = 1.6;
        this.emitterExplosion.gravity = 5;
        this.emitterExplosion.makeParticles('particle_fire');

        //Particules damage
        this.emitterDamage = game.add.emitter(0, 0 , 180);
        this.emitterDamage.setXSpeed(-150, 150);
        this.emitterDamage.setYSpeed(-150, 150);
        this.emitterDamage.minParticleScale = 0.6;
        this.emitterDamage.maxParticleScale = 0.8;
        this.emitterDamage.gravity = 0;
        this.emitterDamage.makeParticles('particle_damage');

        //Particules feu
        this.emitterFire = game.add.emitter(0, 0 , 30);
        this.emitterFire.setXSpeed(0, 0);
        this.emitterFire.setYSpeed(-15, -10);
        this.emitterFire.minParticleScale = 1.8;
        this.emitterFire.maxParticleScale = 1.6;
        this.emitterFire.gravity = 5;
        this.emitterFire.makeParticles('particle_fire');

        //shadows for the scene
        this.shadowmap = game.add.sprite(-20,-20,"shadowmap_game");
        this.shadowmap.blendMode = PIXI.blendModes.MULTIPLY;



        //Ajout du container de lifebar
        this.addLifebar();

        //Gestion inputs
        key1 = game.input.keyboard.addKey(Phaser.Keyboard.D);
        key1.onDown.add(function() {
          this.sei(this.playerA);
        }, this);

        key2 = game.input.keyboard.addKey(Phaser.Keyboard.F);
        key2.onDown.add(function() {
          this.hoi(this.playerA);
        }, this);

        key3 = game.input.keyboard.addKey(Phaser.Keyboard.K);
        key3.onDown.add(function() {
          this.sei(this.playerB);
        }, this);

        key4 = game.input.keyboard.addKey(Phaser.Keyboard.L);
        key4.onDown.add(function() {
          this.hoi(this.playerB);
        }, this);





    },

    update : function(){





    },

    addLifebar: function(){


    },



    fireDot : function(){

    },

    sei: function(player) {
      this.gameSounds.SEI.play();
    },

    hoi: function(player) {
      this.gameSounds.HOI.play();
    }
};
