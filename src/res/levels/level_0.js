
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
    	context.game_over = false;
        var bodies = Matter.Composite.allBodies(engine.world);
        Matter.Events.on(engine, 'collisionActive', function(event) {
            context.game_over = true;
        });
    },

    update : function(context, engine)
    {
    	if(context.game_over)
    		console.log("Winner!!!");
        return context.game_over;
    }

});