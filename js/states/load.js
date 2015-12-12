var loadState = {

    preload : function(){
        console.log("Load state preload");

        // Affichage du fond
        game.add.sprite(0,0,"background_load");

        // Affichage de la progress bar
        //This is the bright blue bar that is hidden by the dark bar
        this.barBg = game.add.sprite(game.world.centerX, game.world.centerY + 80, 'progress_bar_bg');
        this.barBg.anchor.setTo(0.5, 0.5);
        //This bar will get cropped by the setPreloadSprite function as the game loads!
        this.bar = game.add.sprite(game.world.centerX - 240, game.world.centerY + 80, 'progress_bar');
        this.bar.anchor.setTo(0, 0.5);
        game.load.setPreloadSprite(this.bar);

        
        // Chargement des images;
        //game.load.spritesheet('monster' , 'assets/graphics/monster.png', 128, 220, 4);
        game.load.spritesheet('player' , 'assets/graphics/player.png', 40, 80, 2);

        game.load.image('card_template' , 'assets/graphics/card_template.png');
        // Chargement des sons
        game.load.audio('enemy_destroyed',['assets/audio/enemy_destroyed.wav',]);
        
        
        game.load.image('background_game' , 'assets/graphics/background_game.png');
        game.load.image('shadowmap_game' , 'assets/graphics/shadowmap_game.png');
        game.load.image('particle_fire' , 'assets/graphics/particle_fire.png');
        game.load.image('particle_damage' , 'assets/graphics/particle_damage.png');
        
        //musique
        game.load.audio('MonstA',['assets/audio/MonstA.ogg',]);





    },
    create : function(){
        game.global.bgm = game.add.audio("MonstA");
        game.global.bgm.play("",0,0.3,true);
        // On démarre l'état du menu
        game.state.start('menu');
    },

    update : function(){


    }

};
