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
        this.GROUNDLEVEL=400;

        this.STATE_GROUND = 0;
        this.STATE_AIR = 1;
        this.STATE_SEI = 2;
        this.STATE_HOI = 3;
        this.STATE_DEAD = 5;

        this.ATTACK_COOLDOWN = 700;
        this.ATTACK_TIME = 500;
        this.HIT_TIME = 500;

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

        

        this.randomGenerator = new Phaser.RandomDataGenerator(1337);


        //console.log("game state create() finished");


        this.initRound();


        //dot sur le feu
        this.loopFireDot = game.time.events.loop(1000, this.fireDot, this);


        //Particules damage
        this.emitterDamage = game.add.emitter(0, 0 , 180);
        this.emitterDamage.setXSpeed(-150, 150);
        this.emitterDamage.setYSpeed(-150, 150);
        this.emitterDamage.minParticleScale = 0.6;
        this.emitterDamage.maxParticleScale = 0.8;
        this.emitterDamage.gravity = 0;
        this.emitterDamage.makeParticles('particle_damage');


        



        //Ajout du container de lifebar

        //Gestion inputs
        key_D = game.input.keyboard.addKey(Phaser.Keyboard.D);
        key_D.onDown.add(function() {
          this.sei(this.playerA);
        }, this);

        key_F = game.input.keyboard.addKey(Phaser.Keyboard.F);
        key_F.onDown.add(function() {
          this.hoi(this.playerA);
        }, this);

        key_K = game.input.keyboard.addKey(Phaser.Keyboard.K);
        key_K.onDown.add(function() {
          this.sei(this.playerB);
        }, this);

        key_L = game.input.keyboard.addKey(Phaser.Keyboard.L);
        key_L.onDown.add(function() {
          this.hoi(this.playerB);
        }, this);

        //Collision
        game.physics.arcade.collide(this.playerA,this.playerB);

    },

    update : function(){

        this.updatePlayer(this.playerA,this.playerB);
        this.updatePlayer(this.playerB,this.playerA);
        //console.log(game.time.elapsed);

        game.physics.arcade.overlap(this.playerA, this.playerB, this.playerCollision, null, this);

    },
    
    initRound : function(){

        //destruction des players
        if(this.playerA){
            this.shadowmap.kill();
            for(var i = 0, l = this.playerALifeBar.length;i<l;i++){
                   this.playerALifeBar[i].kill();
            }
            this.playerA.kill();
            for(var i = 0, l = this.playerBLifeBar.length;i<l;i++){
                   this.playerBLifeBar[i].kill();
            }
            this.playerB.kill();
        }
        
        
        
        
       //Ajout des players
        this.playerA = game.add.sprite(200, this.GROUNDLEVEL, 'player');
        this.playerA.life = this.MAXHP;
        this.playerA.enableBody = true;
        this.playerA.animations.add('idle', [0,1], 3, true);
        this.playerA.animations.play('idle');
        this.playerA.tint="0x009900";
        this.playerA.direction = this.RIGHT;
        this.playerA.anchor.setTo(0.5, 0.5);
        this.playerA.state = this.STATE_GROUND;
        this.playerA.attackCooldown = 0;
        this.playerA.attackTime = 0;
        this.playerA.hitTime = 0;
        this.playerA.velocity = {x:0,y:0};
        game.physics.enable(this.playerA, Phaser.Physics.ARCADE);
        this.playerALifeBar = [];
        this.addLifebar(true);

        this.playerB = game.add.sprite(game.global.gameWidth - 200, this.GROUNDLEVEL, 'player');
        this.playerB.life = this.MAXHP;
        this.playerB.enableBody = true;
        this.playerB.animations.add('idle', [0,1], 3, true);
        this.playerB.animations.play('idle');
        this.playerB.tint="0x000099";
        this.playerB.direction = this.LEFT;
        this.playerB.anchor.setTo(0.5, 0.5);
        this.playerB.state = this.STATE_GROUND;
        this.playerB.attackCooldown = 0;
        this.playerB.attackTime = 0;
        this.playerB.hitTime = 0;
        this.playerB.velocity = {x:0,y:0};
        game.physics.enable(this.playerB, Phaser.Physics.ARCADE);
        this.playerBLifeBar = [];
        this.addLifebar(false);
        
        //shadows for the scene
        this.shadowmap = game.add.sprite(-20,-20,"shadowmap_game");
        this.shadowmap.blendMode = PIXI.blendModes.MULTIPLY;
        
        this.gameSounds.three_two_one_fight.play();
        game.global.bgm.play("",0,0.3,true);
        this.started = false;
        game.time.events.add(3000, this.startRound, this);

    },
    
    startRound : function(){
        this.started = true;   
    },
    
    

    addLifebar: function(firstplayer){
      if (firstplayer) {
        var player = this.playerA;
        lifebar = this.playerALifeBar;
        var x = 20;
      } else {
        var player = this.playerB;
        lifebar = this.playerBLifeBar;
        var x = 500;
      }

      var y = 20;
      for (var i = 0, l = player.life; i < l; i++) {
        var lifeBarBlock     = game.add.sprite(x ,y, "lifebar");
        lifeBarBlock.scale.setTo(1 / player.life, 1);
        lifebar.push(lifeBarBlock);
        x += 46;
      }

    },

    updatePlayer : function(player,other){
        //face other player if not attacking
        if(player.state === this.STATE_AIR || player.state === this.STATE_GROUND){
            if(player.x > other.x && player.direction === this.RIGHT){
                player.direction = this.LEFT;
            }else if(player.x < other.x && player.direction === this.LEFT){
                player.direction = this.RIGHT;
            }
        }
        player.scale.setTo(player.direction,1);

        //stops player if it is on the ground
        if(player.state === this.STATE_GROUND){
            player.velocity.x = 0;
            player.velocity.y = 0;
        }

        var timeElapsedSec = game.time.elapsed / 1000
        player.x += player.velocity.x * timeElapsedSec;
        player.y += player.velocity.y * timeElapsedSec;

        //check arena bounds
        if(player.x > game.global.gameWidth){
            player.x = game.global.gameWidth;
            player.direction = this.LEFT;
            player.velocity.x = -player.velocity.x;
        }else if(player.x < 0){
            player.x = 0;
            player.direction = this.RIGHT;
            player.velocity.x = -player.velocity.x;
        }

        //gravity
        if(player.state !== this.STATE_GROUND){
            player.velocity.y += 1000 * timeElapsedSec;
        }


        if((player.state === this.STATE_AIR || player.state === this.STATE_HOI)  && player.y > this.GROUNDLEVEL){
            player.y = this.GROUNDLEVEL;
            if(player.state === this.STATE_HOI){
                player.angle = 0;
                player.attackTime = 0;
            }
            player.state = this.STATE_GROUND;
        }

        if(player.state === this.STATE_SEI){
            player.angle += player.direction * 1400 * timeElapsedSec;
        }
        if(player.state === this.STATE_DEAD){
            player.angle += -player.direction * 400 * timeElapsedSec;
        }
        
        if(player.hitTime > 0 ){
            player.hitTime = Math.max(0, player.hitTime - game.time.elapsed);
        }
        if(player.attackTime > 0 ){
            player.attackTime = Math.max(0, player.attackTime - game.time.elapsed);
            if(player.attackTime === 0){
                player.angle = 0;
                if(player.y > this.GROUNDLEVEL){
                    player.state = this.STATE_GROUND;
                    player.y = this.GROUNDLEVEL;
                }else{
                    player.state = this.STATE_AIR;
                }
            }
        }
        if(player.attackCooldown > 0 ){
            player.attackCooldown = Math.max(0, player.attackCooldown - game.time.elapsed);
        }

    },


    fireDot : function(){

    },

    sei: function(player) {
        
        if((player.state === this.STATE_GROUND || player.state === this.STATE_AIR) && (player.attackCooldown === 0 && player.hitTime === 0) && this.started){

            player.state = this.STATE_SEI;
            player.attackTime = this.ATTACK_TIME;
            player.attackCooldown = this.ATTACK_COOLDOWN;
            player.velocity.x = 500 * player.direction;
            player.velocity.y = -550;

            this.gameSounds.SEI.play();
        }
    },

    hoi: function(player) {
        if((player.state === this.STATE_GROUND || player.state === this.STATE_AIR) && (player.attackCooldown === 0 && player.hitTime === 0) && this.started){
            player.attackTime = this.ATTACK_TIME;
            player.attackCooldown = this.ATTACK_COOLDOWN;
            if(player.state === this.STATE_GROUND){

                player.velocity.x = 300 * -player.direction;
                player.velocity.y = -700;
            }else{
                player.velocity.x = 600 * player.direction;
                player.velocity.y = 800;
            }
            player.angle = player.direction * -35;
            player.state = this.STATE_HOI;
            this.gameSounds.HOI.play();
        }

    },


    takeDamage: function(firstplayer) {        
    
          if (firstplayer) {
            var player = this.playerA;
            lifebar = this.playerALifeBar;
          } else {
            var player = this.playerB;
            lifebar = this.playerBLifeBar;
          }

        this.emitterDamage.x=player.x+player.width/2;
        this.emitterDamage.y=player.y+player.height/2;
        this.emitterDamage.start(true, 400, null, 30);
      player.life--;

      var lastElem = lifebar[lifebar.length - 1];
      //Suppression d'un morceau de la barre de vie

      var bounce=game.add.tween(lastElem);

      bounce.to({ x: -500, y : -100, angle: -360}, 500, Phaser.Easing.Linear.In);
      bounce.onComplete.add(function() {
        lastElem.kill();

        //Si le joueur en question est deceday
        if (player.life <= 0) {
            player.state = this.STATE_DEAD;
            game.time.events.add(500, this.annouceWinner, this);
            //player.kill();
        }
      }, this);

      //suppression dans le tableau
      lifebar.pop();

      bounce.start();

    },

    playerCollision: function(){
        
        var aHit = false;
        var bHit = false;
      if ((this.playerA.state === this.STATE_SEI || this.playerA.state === this.STATE_HOI) && this.playerA.hitTime === 0) {
        this.playerA.hitTime = this.HIT_TIME;
        this.takeDamage(false);
        this.playerA.velocity.x = this.playerA.velocity.x / 2;
        this.playerB.velocity.y = -300;
        this.playerB.velocity.x = this.playerA.direction * 300;
          bHit =true;

      }

      if ((this.playerB.state === this.STATE_SEI || this.playerB.state === this.STATE_HOI) && this.playerB.hitTime === 0) {
        this.playerB.hitTime = this.HIT_TIME;
        this.takeDamage(true);
        this.playerB.velocity.x = this.playerB.velocity.x / 2;
        this.playerA.velocity.y = -300;
        this.playerA.velocity.x = this.playerB.direction * 300;
          aHit = true;
      }
        if(aHit){
            this.playerA.state = this.STATE_AIR;   
        }
        if(bHit){
            this.playerB.state = this.STATE_AIR;   
        }
    },
    
    annouceWinner : function(){
        if(this.playerA.state === this.STATE_DEAD && this.playerB.state === this.STATE_DEAD){
            this.gameSounds.double_ko.play();
        }else if(this.playerB.state === this.STATE_DEAD){
            this.gameSounds.green_wins.play();
        }else if(this.playerA.state === this.STATE_DEAD){
            this.gameSounds.blue_wins.play();
        }
        
        game.time.events.add(1500, this.initRound, this);
        
    }
};
