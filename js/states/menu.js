var menuState = {

    init: function(){
    },

    preload : function(){
        console.log("menu state preload");

    },


    create : function(){

        // Affichage du fond
        game.add.sprite(0,0,"background_game");
        
        var credits = game.add.text(game.global.gameWidth - 230, game.global.gameHeight - 120, 'Made for Ludum Dare 34\nTheme : "Two button controls"\n    Code : Vladirien & Palapapaa\n    Graphics : ?\n    Music : ?',
        { font: '14px Arial', fill: '#888888' }); 
        
        
        game.state.start('game');

    },

    update : function(){
        
        if(game.input.activePointer.isDown&&this.clickable){
            
        }


    },


    
};
