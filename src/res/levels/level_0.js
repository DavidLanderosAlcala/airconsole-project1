
LevelSelector.getLevels().push({

    title       : "Level 0",
    description : "Draw a shape",
    bodies : [
        {
            label : "ground",
            isStatic : true,
            position : { x : 0, y : 1 },
            vertices: [ { x: -4, y: 0 },
                        { x: -4, y: 1 },
                        { x: 4, y: 1 },
                        { x: 4, y: 0 } ],
        },
    ],

    hints : [
            {
                /* possible shape */
                position : { x : 0, y : 5 },
                vertices : [ { x: -2, y: 0 },
                             { x: -2, y: 1 },
                             { x: 2, y: 1 },
                             { x: 2, y: 0 },
                             { x: -2, y: 0 } ],
            }
    ],

    setup : function(context)
    {
	    // agregamos una variable al contexto del nivel
    	context.game_over = false;

	    //// si ocurre una colision cualquiera el nivel esta terminado
        Physics.on("beginContact", function(event){
            context.game_over = true;
        });
    },

    update : function(context)
    {
	    // retornamos el estado actual del nivel
        return context.game_over;
    }

});
