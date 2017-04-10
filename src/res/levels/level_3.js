
LevelSelector.getLevels().push({

    title       : "Cruza el pozo",
    description : "Haz cruzar la pelota",
    bodies      : [
        {
            label    : "ball",
            isStatic : false,
            position : { x : -300, y : 800 },
            type     : "circle",
            radio    : 25,
        },
        {
            label : "plattformA",
            isStatic : true,
            position : { x : -600, y : 0 },
            vertices: [
                {x : -400, y : 400 },
                {x : -400, y : 0 },
                {x : 400, y : 0 },
                {x : 400, y : 400 },
            ],
        },
        {
            label : "plattformB",
            isStatic : true,
            position : { x : 600, y : 0 },
            vertices: [
                {x : -400, y : 400 },
                {x : -400, y : 0 },
                {x : 400, y : 0 },
                {x : 400, y : 400 },
            ],
        },
        {
            label : "sensor",
            isStatic : true,
            isSensor : true,
            position : { x : 640, y : 300 },
            vertices: [
                {x : -400, y : 400 },
                {x : -400, y : 0 },
                {x : 400, y : 0 },
                {x : 400, y : 400 },
            ],
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
            if( Physics.getLabel(event.bodyA) == "sensor" || Physics.getLabel(event.bodyB) == "sensor" )
            {
                if( Physics.getLabel(event.bodyA) == "ball" || Physics.getLabel(event.bodyB) == "ball" )
                {
                    context.gameover = true;
                }
            }
        });
    },

    update : function(context, engine)
    {
        if(Physics.getPosition(context.ball).y > Screen.getHeight())
        {
            Physics.clearForces(context.ball);
            Physics.setPosition(context.ball, { x : (Screen.getWidth()/2) - 300, y : 0 });
        }
        return context.gameover;
    }

});
