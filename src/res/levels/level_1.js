
LevelSelector.getLevels().push({

    title       : "Que no caiga",
    description : "dibuja una plataforma entre los pilares",
    bodies      : [
        {
            label : "towerA",
            isStatic : true,
            position : { x : -200, y : 100 },
            vertices: [
                {x : 0, y : 400 },
                {x : 0, y : 0 },
                {x : 50, y : 0 },
                {x : 50, y : 400 },
            ],
        },
        {
            label : "towerB",
            isStatic : true,
            position : { x : 200, y : 100 },
            vertices: [
                {x : 0, y : 400 },
                {x : 0, y : 0 },
                {x : 50, y : 0 },
                {x : 50, y : 400 },
            ],
        },
        {
            label : "rock",
            isStatic : false,
            position : { x : 0, y : 1000 },
            vertices: [
                {x : -25, y : 25 },
                {x : -25, y : -25 },
                {x : 25, y : -25 },
                {x : 25, y : 25 },
            ],
        },
    ],

    setup : function(context, engine)
    {
        bodies = Matter.Composite.allBodies(engine.world);
        for(var i = 0; i < bodies.length; i++)
        {
            if(bodies[i].label == "rock")
            {
                context.rock = bodies[i];
                break;
            }
        }
    },

    update : function(context, engine)
    {
	    // retornamos el estado actual del nivel
        if(context.rock.position.y >= 0)
        {
            Matter.Body.setVelocity(context.rock, { x : 0, y : 0 });
            Matter.Body.setPosition(context.rock, { x : 0, y : -1000 });
        }
        return false;
    }

});
