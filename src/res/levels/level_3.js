
LevelSelector.getLevels().push({

    title       : "Cruza el pozo",
    description : "Haz cruzar la pelota",
    bodies      : [
        {
            label : "towerA",
            isStatic : true,
            position : { x : -600, y : 0 },
            vertices: [
                {x : 0, y : 400 },
                {x : 0, y : 0 },
                {x : 400, y : 0 },
                {x : 400, y : 400 },
            ],
        },
        {
            label : "towerB",
            isStatic : true,
            position : { x : 200, y : 0 },
            vertices: [
                {x : 0, y : 400 },
                {x : 0, y : 0 },
                {x : 400, y : 0 },
                {x : 400, y : 400 },
            ],
        },
        {
            label    : "ball",
            isStatic : false,
            position : { x : -300, y : 600 },
            type     : "circle",
            radio    : 25,
        },
    ],

    setup : function(context)
    {
        context.gameover = false;
        var bodies = Physics.getAllBodies();
        for(var i = 0; i < bodies.length; i++)
        {
            if(Physics.getLabel(bodies[i]) == "ball")
            {
                // Buscamos ball y guardamos una referencia
                // para no volver a buscarla en cada llamada a update
                context.ball = bodies[i];
                break;
            }
        }

        Physics.on("beginContact", function(event){
            if( Physics.getLabel(event.bodyA) == "towerB" || Physics.getLabel(event.bodyA) == "ball" )
            {
                if( Physics.getLabel(event.bodyB) == "towerB" || Physics.getLabel(event.bodyB) == "ball" )
                {
                    context.gameover = true;
                }
            }
        });
    },

    update : function(context, engine)
    {
        if(context.ball.position.y > 300)
        {
            Physics.setVelocity(context.ball, { x : 0, y : 0 });
            Physics.setPosition(context.ball, { x : -300, y : -600 });
        }
        return context.gameover;
    }

});
