
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
    ],

    setup : function(context, engine)
    {
	// agregamos una variable al contexto del nivel
    	context.game_over = false;

	// si ocurre una colision cualquiera el nivel esta terminado
        Matter.Events.on(engine, 'collisionActive', function(event) {
            context.game_over = true;
        });
    },

    update : function(context, engine)
    {
	// retornamos el estado actual del nivel
        return context.game_over;
    }

});
