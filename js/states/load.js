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
        
        
        game.load.image('background_game' , 'assets/graphics/background_game.png');
        game.load.image('shadowmap_game' , 'assets/graphics/shadowmap_game.png');
        game.load.image('particle_fire' , 'assets/graphics/particle_fire.png');
        game.load.image('particle_damage' , 'assets/graphics/particle_damage.png');
        
        //musique
        game.load.audio('theme',['assets/audio/theme.ogg',]);
        
        //sons
        game.load.audio('SEI',['assets/audio/sei.ogg',]);
        game.load.audio('HOI',['assets/audio/hoi.ogg',]);
        game.load.audio('perfect',['assets/audio/perfect.ogg',]);
        game.load.audio('green_wins',['assets/audio/green_wins.ogg',]);
        game.load.audio('blue_wins',['assets/audio/blue_wins.ogg',]);
        game.load.audio('double_ko',['assets/audio/double_ko.ogg',]);
        game.load.audio('three_two_one_fight',['assets/audio/three_two_one_fight.ogg',]);
        
        // Chargement des sons
        game.load.audio('enemy_destroyed',['assets/audio/enemy_destroyed.wav',]);




    },
    create : function(){
        game.global.bgm = game.add.audio("theme");
        
        // On démarre l'état du menu
        game.state.start('menu');
    },

    update : function(){


    }

};
