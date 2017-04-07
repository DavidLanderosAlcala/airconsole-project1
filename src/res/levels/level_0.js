
LevelSelector.getLevels().push({

    title       : "Level 0",
    description : "Draw a shape",
    bodies      : [
        {
            label : "ground",
            isStatic : true,
            position : { x : 0, y : 100 },
            vertices: [
                {x : -400, y : 0 },
                {x : -400, y : 100 },
                {x : 400,  y : 100 },
                {x : 400,  y : 0 }
            ],
        },
        {
            hint : true,
            label : "hint",
            isStatic : true,
            position : { x : 0, y : 500 },
            vertices: [
                {x : -200, y : 0 },
                {x : -200, y : 100 },
                {x : 200,  y : 100 },
                {x : 200,  y : 0 }
            ],
        },
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
